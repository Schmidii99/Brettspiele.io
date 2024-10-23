import { createClient } from "redis";
import { getNewGame, type Game } from "./GameManager.ts";
import * as log from "log";
import { REDIS_URL } from "../config.ts";

export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    connectTimeout: 50000,
  },
});

// returns null if game does not exists
export async function getGame(gameType: string, gameId: string): Promise<Game | null> {
  return await redisClient.json.get(gameType + ":" + gameId);
}

export async function createGame(gameType: string, gameId: string) {
  await redisClient.json.set("tictactoe:" + gameId, "$", getNewGame(gameType));
}

export async function addPlayer(gameType: string, gameId: string, session: string): Promise<void> {
  await redisClient.json.set(`${gameType}:${gameId}`, `$.players.${session}`, "connected");
  // add chat message
  await redisClient.json.arrAppend(`${gameType}:${gameId}`, `$.chat`, "A player has joined the game.");
  await redisClient.publish(`${gameType}:${gameId}:chat`, "A player has joined the game.");
  log.info("Added player to game.");
}

export async function disconnectPlayer(gameType: string, gameId: string, session: string): Promise<void> {
  await redisClient.json.set(`${gameType}:${gameId}`, `$.players.${session}`, "disconnected");
  // add chat message
  await redisClient.json.arrAppend(`${gameType}:${gameId}`, `$.chat`, "A player has left the game.");
  await redisClient.publish(`${gameType}:${gameId}:chat`, "A player has left the game.");
  log.info("Removed player from game.");
}
