import {addPlayer, disconnectPlayer, getGame, redisClient} from "../DatabaseManager.ts";
import {getRandomInt} from "../helper.ts";
import * as log from "log";
import {processChatChange} from "../../main.ts";
import { type Socket } from "socket_io";
import {createMemoryGame, getNewGame} from "../GameManager.ts";

export async function initMemory(info: { gameType: string; gameId: string }, socket: Socket, game: any, session: string, subscriber: any): Promise<void> {
    socket.on("makeMove", (args: {index1: number, index2: number}) => makeMove(info, args.index1, args.index2, session, socket));
    socket.on("changeBoardSize", (args: {size: number}) => changeBoardSize(info, args.size, session));

    if (Object.keys(game.players).length + 1 <= 2 || (game.players[session] as {status: string} || {status: ""}).status == "disconnected") {
        await addPlayer(info.gameType, info.gameId, session);

        let playerSymbol: string = "";
        // evaluate player symbol - check if player reconnected - else choose player symbol based on other player or choose random
        if (game.players[session] != null || (game.players[session] as {status: string} || {status: ""}).status == "disconnected") {
            // player is reconnecting - get symobol from db
            playerSymbol = await redisClient.json.get(`${info.gameType}:${info.gameId}`, {path: `$.players.${session}.symbol`});
        } else if (Object.keys(game.players).length == 0) {
            // first player to join
            playerSymbol = getRandomInt(2) == 0 ? "X" : "O";
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.players.${session}.symbol`, playerSymbol);
            if (playerSymbol == "X") {
                await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.currentTurn`, session);
            }
        } else {
            // second player to join
            const allPlayers = await redisClient.json.get(`${info.gameType}:${info.gameId}`, {path: `$.players`});

            // choose playersymbol based on other player
            let opponentSymbol = "";
            // find opponent session and set his symbol
            Object.values(allPlayers[0]).forEach((playerObj: any) => {
                if (playerObj.symbol != undefined) { opponentSymbol = playerObj.symbol; }
            });
            playerSymbol = opponentSymbol == "X" ? "O" : "X";

            await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.players.${session}.symbol`, playerSymbol);
            // check if this player starts the game!
            if (playerSymbol == "X") {
                await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.currentTurn`, session);
            }
            // set gamestate to running
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.gameState.gameStatus`, "running");
            game.gameState.gameStatus = "running";
        }

        // weird glitch where playersymbol is a array (I think this does not happen anymore can prob. be removed)
        if (typeof(playerSymbol) == "object")
            playerSymbol = playerSymbol[0];

        socket.emit("playerType", ["player", playerSymbol]);
        socket.on("disconnect", async () => {
            await disconnectPlayer(info.gameType, info.gameId, session);
            subscriber.quit();
        });
    } else {
        log.info("Spectator joined");
        socket.emit("playerType", ["spectator"]);
    }

    // subscribe after player as been added
    await subscriber.subscribe(`${info.gameType}:${info.gameId}:chat`, (msg: string, _channel: string) => {processChatChange(msg, socket)});
    await subscriber.subscribe(`${info.gameType}:${info.gameId}:reveal`, (msg: string, _channel: string) => {socket.emit("revealCards", msg)});

    if (game.gameState.gameStatus === "running") {
        game.gameState.yourTurn = game.currentTurn == session;
        await publishGameState(info.gameType, info.gameId, game.gameState);
    }
}

async function publishGameState(gameType: string, gameId: string, state: any) {
    // publish game state to all players
    await redisClient.publish(`${gameType}:${gameId}:gamestate`, JSON.stringify(state));
}

async function makeMove(info: {gameType: string, gameId: string}, index1: number, index2: number, session: string, socket: Socket) {
    // get current game state
    const game = await getGame(info.gameType, info.gameId);
    if (game == null) { return; }
    // check if player is allowed to make a move
    if (game.currentTurn != session || game.gameState.gameStatus != "running") { return; }

    // check if indices are not revealed yet
    if (game.gameState.state[index1] != 0 || game.gameState.state[index2] != 0) { return; }

    // check if a pair was clicked or not
    if (game.hiddenState[index1] == game.hiddenState[index2]) {
        game.gameState.state[index1] = game.hiddenState[index1];
        game.gameState.state[index2] = game.hiddenState[index2];

        await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.gameState.state`, game.gameState.state);
    } else {
        // the clicked pair is not the same card
        await redisClient.publish(`${info.gameType}:${info.gameId}:reveal`, JSON.stringify([
            {index: index1, value: game.hiddenState[index1]},
            {index: index2, value: game.hiddenState[index2]}
        ]));
    }



    // get session after current player
    const allSessions = Object.keys(game.players);
    const nextPlayerIndex = (allSessions.indexOf(session) + 1) % allSessions.length;

    // set next player
    await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.currentTurn`, allSessions[nextPlayerIndex]);

    // publish gamestate
    await redisClient.publish(`${info.gameType}:${info.gameId}:gamestate`, JSON.stringify(game.gameState));
}

function checkForWin(board: Array<number>, score1: number, score2: number): number {
    for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) { return 0; }
    }

    return score1 > score2 ? 1 : 2;
}

async function changeBoardSize(info: {gameType: string, gameId: string}, size: number, session: string) {
    log.info("Recieved board size change to size: " + size);
    if (size != 6 && size != 8 && size != 10 )  { return; }
    // get current game state
    const game = await getGame(info.gameType, info.gameId);
    if (game == null) { return; }
    // check if game is not running and size is valid
    if (game.gameState.gameStatus != "lobby")   { return; }

    const newGame = createMemoryGame(size);

    await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.hiddenState`, newGame.hiddenState);
    await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.gameState.state`, newGame.gameState.state);
}
