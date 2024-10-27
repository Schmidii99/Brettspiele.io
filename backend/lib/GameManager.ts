export type Game = {
  currentTurn: string;
  players: { [session: string]: {status: "connected" | "disconnected"} };
  gameState: {
    gameStatus: "lobby" | "running" | "ended";
    // deno-lint-ignore no-explicit-any
    state: any;
  };
  chat: Array<string>;
}

export function getNewGame(gameType: string) {
  const baseGame: Game = {
    currentTurn: "",
    players: {},
    gameState: {
      gameStatus: "lobby",
      state: {},
    },
    chat: [],
  };

  switch (gameType) {
    case "tictactoe":
      baseGame.gameState.state = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      return baseGame;
    default:
      return baseGame;
  }
}
