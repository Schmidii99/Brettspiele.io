import { createClient } from "redis";
import { getNewGame } from "./GameManager.ts";

export const redisClient = createClient({
  url: Deno.env.get("REDIS_URL") ?? "redis://localhost:6379",
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
