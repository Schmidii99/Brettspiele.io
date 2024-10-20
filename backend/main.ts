import { serve } from "http_server";
import { Server } from "socket_io";
import { FRONTEND_SERVER } from "./config.ts";
import { createGame, getGame, redisClient } from "./lib/DatabaseManager.ts";

main();

async function main() {
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
    console.log("a user connected - checking headers...");

    if (socket.handshake.headers.get("x-session") == null) {
      // close socket if session header is not set
      socket.disconnect();
      console.log("Session header invalid! Client disconnected!");
      return;
    } else {
      // validate session
      const sessionKey = socket.handshake.headers.get("x-session")!;
      if (sessionKey.length !== 36 || sessionKey.split("-").length !== 5) {
        socket.disconnect();
        console.log("Session header invalid! Client disconnected!");
        return;
      }
    }
    console.log("Session valid");

    // register events
    socket.on("gameInfo", processGameInfo);
  });

  await serve(io.handler(), {
    port: 8080,
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
