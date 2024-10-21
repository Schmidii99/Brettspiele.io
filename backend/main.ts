import { serve } from "http_server";
import { Server } from "socket_io";
import { FRONTEND_SERVER, SERVER_PORT } from "./config.ts";
import { createGame, getGame, redisClient } from "./lib/DatabaseManager.ts";
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
    const sessionKey: string | null = socket.handshake.headers.get("x-session")!;
    if (sessionKey == null || sessionKey.length !== 36 || sessionKey.split("-").length !== 5) {
      // close socket if session header is not valid
      socket.disconnect();
      log.warn("User connected with invalid header", { header: sessionKey});
      return;
    }

    log.info("User successfully connected!");

    // register events
    socket.on("gameInfo", processGameInfo);
  });

  await serve(io.handler(), {
    port: SERVER_PORT,
  });
}

async function processGameInfo(
  info: { gameType: string; gameId: string },
): Promise<void> {
  if (info.gameType == null || info.gameId == null) {
    return;
  }

  const game = await getGame(info.gameType, info.gameId);

  if (game == null) {
    await createGame(info.gameType, info.gameId);
  }
}