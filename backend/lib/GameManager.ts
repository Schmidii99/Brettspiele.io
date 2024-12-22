import {GameTypes} from "./GameTypes.ts";
import {shuffleArray} from "./helper.ts";

export type Game = {
  currentTurn: string;
  players: { [session: string]: {status: "connected" | "disconnected"} };
  gameState: {
    gameStatus: "lobby" | "running" | "ended";
    // deno-lint-ignore no-explicit-any
    state: any;
  };
  chat: Array<string>;
  hiddenState: any;
}

const baseGame: Game = {
  currentTurn: "",
  players: {},
  gameState: {
    gameStatus: "lobby",
    state: {},
  },
  chat: [],
  hiddenState: {}
};

export function getNewGame(gameType: string) {
  switch (gameType) {
    case "tictactoe":
      baseGame.gameState.state = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      return baseGame;
    case "connect4":
      baseGame.gameState.state = Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0));
      return baseGame;
    case "memory":
      return createMemoryGame(8);
    default:
      return baseGame;
  }
}

export function createMemoryGame(size: number) {
  // even size is need cause you always match two cards
  if (size * size % 2 != 0) { throw new Error("size * size must be a even number!"); }
  // visible cards for the users
  baseGame.gameState.state = Array.from({ length: size * size }, () => 0);
  baseGame.hiddenState = [];
  for (let i = 0; i < (size * size / 2); i++) {
    (baseGame.hiddenState as Array<number>).push(i);
    (baseGame.hiddenState as Array<number>).push(i);
  }
  shuffleArray(baseGame.hiddenState);

  return baseGame;
}
