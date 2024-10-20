export function getNewGame(gameType: string) {
  const baseGame: {
    players: Array<string>;
    gameState: {
      gameStatus: "lobby" | "running" | "ended";
      // deno-lint-ignore no-explicit-any
      state: any;
    };
    chat: Array<string>;
  } = {
    players: [],
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
