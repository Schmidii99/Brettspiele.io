import { serve } from "http_server";
import { Server, type Socket } from "socket_io";
import { FRONTEND_SERVER, SERVER_PORT, SESSION_HEADER } from "./config.ts";
import { addPlayer, createGame, disconnectPlayer, getGame, reconnectPlayer, redisClient } from "./lib/DatabaseManager.ts";
import { setupLogger } from "./lib/LogManager.ts";
import * as log from "log";

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

  // check if game is not full
  if (Object.keys(game.players).length + 1 <= 2) {
    await addPlayer(info.gameType, info.gameId, session);
    socket.emit("playerType", "player");
    socket.on("disconnect", async () => {
      await disconnectPlayer(info.gameType, info.gameId, session);
    });
  } else {
    socket.emit("playerType", "spectator");
  }

  if (!game.players[session]) {
    // check if game needs to be started
    switch (info.gameType) {
      case "tictactoe":
        if (Object.keys(game.players).length + 1 == 2) {
          log.info("Start game");
        }
    }
  }
}