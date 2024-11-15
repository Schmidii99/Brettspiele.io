import {addPlayer, disconnectPlayer, getGame, redisClient} from "./DatabaseManager.ts";
import {getRandomInt} from "./helper.ts";
import * as log from "log";
import {processChatChange} from "../main.ts";
import { type Socket } from "socket_io";

export async function initConnect4(info: { gameType: string; gameId: string }, socket: Socket, game: any, session: string, subscriber: any): Promise<void> {
    socket.on("makeMove", (args: {column: number}) => makeMove(info, args.column, session));
    if (Object.keys(game.players).length + 1 <= 2 || (game.players[session] as {status: string} || {status: ""}).status == "disconnected") {
        await addPlayer(info.gameType, info.gameId, session);

        let playerSymbol: string = "";
        // evaluate player symbol
        // check if player reconnected
        // else choose player symbol based on other player or choose random
        if (game.players[session] != null || (game.players[session] as {status: string} || {status: ""}).status == "disconnected") {
            // player is reconnecting - get symobol from db
            playerSymbol = await redisClient.json.get(`${info.gameType}:${info.gameId}`, {path: `$.players.${session}.symbol`});
            log.info("Got Symbol from db: " + playerSymbol);
        } else if (Object.keys(game.players).length == 0) {
            // first player to join
            playerSymbol = getRandomInt(2) == 0 ? "X" : "O";
            log.debug("Set random symbol: " + playerSymbol);
            // set player symbol in db
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.players.${session}.symbol`, playerSymbol);
            // check if this player starts the game!
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
                if (playerObj.symbol != undefined) {
                    opponentSymbol = playerObj.symbol;
                }
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

    if (game.gameState.gameStatus === "running") {
        // publish game state to all players
        await redisClient.publish(`${info.gameType}:${info.gameId}:gamestate`, JSON.stringify(game.gameState.state));
    }
}

async function makeMove(info: {gameType: string, gameId: string}, column: number, session: string) {
    // get current game state
    const game = await getGame(info.gameType, info.gameId);
    if (game == null) { return; }
    // check if player is allowed to make a move
    if (game.currentTurn != session || game.gameState.gameStatus != "running") { return; }
    // check board boundaries and for empty field
    if (column > 6 || column < 0) {
        log.warn(session + " sent a coordinate out of bounds! " + info.gameType + ":" + info.gameId + " column:" + column);
        return;
    }
    if (game.gameState.state[0][column] != 0) {
        return;
    }

    // get session after current player
    const allSessions = Object.keys(game.players);
    const nextPlayerIndex = (allSessions.indexOf(session) + 1) % allSessions.length;

    let winner = 0;

    // make move
    for (let i = 1; i < 6; i++) {
        if (game.gameState.state[i][column] != 0) {
            game.gameState.state[i - 1][column] = (game.players[session] as any)["symbol"] == "X" ? 1 : 2;
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, "$.gameState.state", game.gameState.state);

            // check for winner
            winner = checkForWin(i, column, game.gameState.state);
            break;
        } else if (i == 5) {
            game.gameState.state[i][column] = (game.players[session] as any)["symbol"] == "X" ? 1 : 2;
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, "$.gameState.state", game.gameState.state);

            // check for winner
            winner = checkForWin(i, column, game.gameState.state);
        }
    }

    if (winner != 0) {
        await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.gameState.gameStatus`, "ended");
        await redisClient.publish(`${info.gameType}:${info.gameId}:chat`, "Player " + (winner == 1 ? " X " : " O ") + "has won!");
        await redisClient.json.arrAppend(`${info.gameType}:${info.gameId}`, `$.chat`, "Player " + (winner == 1 ? " X " : " O ") + "has won!");
    } else {
        // game did not end yet
        // check for draw
        let draw: boolean = true;
        game.gameState.state.forEach((row: Array<number>) => {
            row.forEach((column: number) => {
                if (column == 0) {
                    draw = false;
                }
            })
        });
        if (draw) {
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.gameState.gameStatus`, "ended");
            await redisClient.publish(`${info.gameType}:${info.gameId}:chat`, "Draw!");
        } else {
            // set next player
            await redisClient.json.set(`${info.gameType}:${info.gameId}`, `$.currentTurn`, allSessions[nextPlayerIndex]);
        }
    }

    // publish gamestate
    await redisClient.publish(`${info.gameType}:${info.gameId}:gamestate`, JSON.stringify(game.gameState.state));
}

function checkForWin(row: number, ycolumn: number, board: Array<Array<number>>): number {
    return 0;
}
