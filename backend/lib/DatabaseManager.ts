import { createClient } from "redis";
import { getNewGame } from "./GameManager.ts";
import process from "node:process";

export const redisClient = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
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
  console.log("Successfully created!");
}
