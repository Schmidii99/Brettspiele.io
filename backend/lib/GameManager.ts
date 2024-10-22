export type Game = {
  players: { [session: string]: "connected" | "disconnected" };
  gameState: {
    gameStatus: "lobby" | "running" | "ended";
    // deno-lint-ignore no-explicit-any
    state: any;
  };
  chat: Array<string>;
}

export function getNewGame(gameType: string) {
  const baseGame: Game = {
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
