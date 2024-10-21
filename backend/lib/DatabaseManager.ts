import { createClient } from "redis";
import { getNewGame } from "./GameManager.ts";
import * as log from "log";
import { REDIS_URL } from "../config.ts";

export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    connectTimeout: 50000,
  },
});

// returns null if game does not exists
export async function getGame(gameType: string, gameId: string) {
  return await redisClient.json.get(gameType + ":" + gameId);
}

export async function createGame(gameType: string, gameId: string) {
  await redisClient.json.set("tictactoe:" + gameId, "$", getNewGame(gameType));
  log.error("Game successfully created!", {gameId, gameType});
}
