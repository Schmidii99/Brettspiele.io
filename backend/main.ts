import { serve } from "http_server";
import { Server, type Socket } from "socket_io";
import { FRONTEND_SERVER, SERVER_PORT, SESSION_HEADER } from "./config.ts";
import { addPlayer, createGame, disconnectPlayer, getGame, redisClient } from "./lib/DatabaseManager.ts";
import { setupLogger } from "./lib/LogManager.ts";
import * as log from "log";
import { getRandomInt } from "./lib/helper.ts";

main();

async function main() {
  // init logging
  setupLogger();

  // init redis
  // make a connection to the local instance of redis
  await redisClient.connect();

  const io = new Server({
    cors: {
      origin: FRONTEND_SERVER,
      methods: ["GET", "POST"],
    },
  });

  // handle socket connection
  io.on("connection", (socket) => {
    const sessionKey: string | null = socket.handshake.headers.get(SESSION_HEADER);
    if (sessionKey == null || sessionKey.length !== 36 || sessionKey.split("-").length !== 5) {
      // close socket if session header is not valid
      socket.disconnect();
      log.warn("User connected with invalid header", { header: sessionKey});
      return;
    }

    log.info("User successfully connected!");

    // register events
    socket.on("gameInfo", (info: { gameType: string; gameId: string }) => processGameInfo(info, socket));
  });

  await serve(io.handler(), {
    port: SERVER_PORT,
  });
}


async function processGameInfo(
  info: { gameType: string; gameId: string },
  socket: Socket
): Promise<void> {
  if (info.gameType == null || info.gameId == null || socket == null) {
    return;
  }

  const session: string | null = socket.handshake.headers.get(SESSION_HEADER)!;
  let game = await getGame(info.gameType, info.gameId);

  // if game does not exist, create it
  if (game == null) {
    await createGame(info.gameType, info.gameId);
    game = await getGame(info.gameType, info.gameId);
  } 

  // ensure that game was created
  if (!game) {
    log.error("Game was not created successfully!", {gameType: info.gameType, gameId: info.gameId});
    return;
  }

  // register subscriber clientand events
  const subscriber: any = redisClient.duplicate();
  subscriber.connect();

  await subscriber.subscribe(`${info.gameType}:${info.gameId}:chat`, (msg: string, _channel: string) => {processChatChange(msg, socket)});
  await subscriber.subscribe(`${info.gameType}:${info.gameId}:gamestate`, (msg: string, _channel: string) => {processGameStateChange(msg, socket)});
  

  if (Object.keys(game.players).length + 1 <= 2 || (game.players[session] as {status: string} || {status: ""}).status == "disconnected") {
    await addPlayer(info.gameType, info.gameId, session);

    let playerSymbol: string = "";
    // evaluate player symbol
    // check if player reconnected
    // else choose player symbol based on other player or choose random
    if (game.players[session] != null || (game.players[session] as {status: string} || {status: ""}).status == "disconnected") {
      // player is reconnecting - get symobol from db
      playerSymbol = await redisClient.json.get(`${info.gameType}:${info.gameId}`, {path: `$.players.${session}.symbol`});
      log.info("Got Symbol from db: " + playerSymbol);
    } else if (Object.keys(game.players).length == 0) {
      // first player to join
      playerSymbol = getRandomInt(2) == 0 ? "X" : "O";
      log.debug("Set random symbol: " + playerSymbol);
      // set player symbol in db
      await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.players.${session}.symbol`, playerSymbol);
    } else {
      // second player to join
      const opponent = await redisClient.json.get(`${info.gameType}:${info.gameId}`, {path: `$.players`});
      // choose playersymbol based on other player
      playerSymbol = (Object.values(opponent)[0] as {symbol: "X" | "O"}).symbol == "X" ? "O" : "X";
      await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.players.${session}.symbol`, playerSymbol);
    }

    // weird glitch where playersymbol is a array
    if (typeof(playerSymbol) == "object")
      playerSymbol = playerSymbol[0];

    socket.emit("playerType", ["player", playerSymbol]);
    socket.on("disconnect", async () => {
      await disconnectPlayer(info.gameType, info.gameId, session);
      subscriber.quit();
    });
  } else {
    log.info("Spectator joined");
    socket.emit("playerType", ["spectator"]);
  }

  if (!game.players[session]) {
    // check if game needs to be started
    switch (info.gameType) {
      case "tictactoe":
        if (Object.keys(game.players).length + 1 == 2) {
          // publish game state to all players
          await redisClient.publish(`${info.gameType}:${info.gameId}:gamestate`, JSON.stringify(game.gameState.state));
        }
    }
  } 
}

// subscribe event from redis db
async function processChatChange(msg: string, socket: Socket) {
  await socket.emit("chatUpdate", msg);
}

// subscribe event from redis db
async function processGameStateChange(msg: string, socket: Socket) {
  await socket.emit("gameStateUpdate", JSON.parse(msg));
}