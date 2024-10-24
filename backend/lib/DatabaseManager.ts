import { createClient } from "redis";
import { getNewGame, type Game } from "./GameManager.ts";
import * as log from "log";
import { GAME_TTL_AFTER_DISCONNECT, REDIS_URL } from "../config.ts";

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
  let game: Game | null = await getGame(gameType, gameId);
  if (game == null) { return; }
  if (game.players[session] == null) {
    // create session object if not exists
    await redisClient.json.set(`${gameType}:${gameId}`, `$.players.${session}`, {});
  }
  await redisClient.json.set(`${gameType}:${gameId}`, `$.players.${session}.status`, "connected");
  // remove TTL from key
  await redisClient.persist(`${gameType}:${gameId}`);
  // add chat message
  await redisClient.json.arrAppend(`${gameType}:${gameId}`, `$.chat`, "A player has joined the game.");
  await redisClient.publish(`${gameType}:${gameId}:chat`, "A player has joined the game.");
  log.info("Added player to game.");
}

export async function disconnectPlayer(gameType: string, gameId: string, session: string): Promise<void> {
  await redisClient.json.set(`${gameType}:${gameId}`, `$.players.${session}.status`, "disconnected");

  const game: Game | null = await getGame(gameType, gameId);
  if (game != null) {
    let allPlayersDisconnected = true;
    // check if the status of all players is disconnected
    Object.values(game.players).forEach((player: {status: "connected" | "disconnected"}) => {
      if (player.status == "connected") {
        allPlayersDisconnected = false;
      }
    });
    if (allPlayersDisconnected) {
      await redisClient.expire(`${gameType}:${gameId}`, GAME_TTL_AFTER_DISCONNECT);
    } 
  }

  // add chat message
  await redisClient.json.arrAppend(`${gameType}:${gameId}`, `$.chat`, "A player has left the game.");
  await redisClient.publish(`${gameType}:${gameId}:chat`, "A player has left the game.");
  log.info("Removed player from game.");
}
