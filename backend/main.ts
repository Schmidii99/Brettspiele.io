import { serve } from "http_server";
import { Server, type Socket } from "socket_io";
import { FRONTEND_SERVER, MAX_GAME_ID_LEN, MAX_MESSAGE_LEN, SERVER_PORT, SESSION_HEADER } from "./config.ts";
import { createGame, getGame, redisClient } from "./lib/DatabaseManager.ts";
import { setupLogger } from "./lib/LogManager.ts";
import * as log from "log";
import { sanitizeString } from "./lib/helper.ts";
import { GameTypes } from "./lib/GameTypes.ts";
import * as TicTacToe from "./lib/TicTacToe.ts";
import * as Connect4 from "./lib/Connect4.ts";

main();

async function main() {
  // init logging
  setupLogger();

  // init redis
  // make a connection to the local instance of redis
  await redisClient.connect();

  const io = new Server({
    path: "/api/",
    cors: {
      origin: FRONTEND_SERVER,
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

async function processGameInfo(info: { gameType: string; gameId: string }, socket: Socket): Promise<void> {
  if (info.gameType == null || info.gameId == null || socket == null) {
    return;
  }

  // limit game id
  if (info.gameId.length > MAX_GAME_ID_LEN || (info.gameId.match(/[^a-zA-Z\d\s:]/g) || []).length != 0) {
    socket.disconnect();
    log.warn("Mal formed game id: " + info.gameId);
    return;
  }
  if (!(info.gameType in GameTypes)) {
    socket.disconnect();
    log.warn("Invalid gameType: " + info.gameType);
    return;
  }

  const session: string = socket.handshake.headers.get(SESSION_HEADER)!;
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

  await subscriber.subscribe(`${info.gameType}:${info.gameId}:gamestate`, (msg: string, _channel: string) => {processGameStateChange(msg, socket)});

  if (info.gameType === "tictactoe")
    await TicTacToe.initTicTacToe(info, socket, game, session, subscriber);
  else if (info.gameType === "connect4")
    await Connect4.initConnect4(info, socket, game, session, subscriber);
}

// subscribe event from redis db
export function processChatChange(msg: string, socket: Socket) {
  if (msg.length > MAX_MESSAGE_LEN) {
    msg = msg.substring(0, MAX_MESSAGE_LEN);
  }
  socket.emit("chatUpdate", sanitizeString(msg));
}

// subscribe event from redis db
function processGameStateChange(msg: string, socket: Socket) {
  socket.emit("gameStateUpdate", JSON.parse(msg));
}