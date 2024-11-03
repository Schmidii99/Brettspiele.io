<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from "vue";
  import { openSocket } from "@/lib/socketManager";
  import { copyToClipboard, generateRandomString } from "@/lib/helper";
  import { Socket } from "socket.io-client";
  import { useRoute, useRouter} from "vue-router";
  import Field from "@/components/tictactoe/Field.vue";
  import Chatbox from "@/components/Chatbox.vue";
  import ChatMessage from "@/components/ChatMessage.vue";
  import { QrcodeSvg } from "qrcode.vue";
import SimpleButton from "@/components/SimpleButton.vue";
import { MAX_GAME_ID_LEN } from "@/config";

  let socket: null | Socket;
  let route = useRoute();
  let isRunning = ref(false);
  let copied = ref(false);
  let myTurn = ref(false);

  let board = ref({state: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]});
  let highlightMatrix = ref({state: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]});
  let isSpectator = ref(false);
  let playerSymbol = ref("");
  let gameWinner = ref("");

  let chat = ref(["Welcome to TicTacToe!"]);

  const currentRouter = useRouter();

  onMounted(async () => {
    // validate game id
    let gameId: string = route.params["gameid"] as string;
    if (gameId.length > MAX_GAME_ID_LEN || (gameId.match(/[^a-zA-Z\d\s:]/g) || []).length != 0) {
      currentRouter.replace("/tictactoe/" + generateRandomString(MAX_GAME_ID_LEN));
      await new Promise(f => setTimeout(f, 1));
      location.reload();
    } else {
      socket = openSocket(`ws://${location.hostname}`, afterConnect);
    }
  });

  onUnmounted(() => {
    socket?.disconnect();
  });

  function afterConnect() {
    if (socket == null)
      return;

    // listen to events
    socket.on("gameStateUpdate", gameStateUpdate);
    socket.on("playerType", (type: any) => {
      if (type[0] == "spectator")
        isSpectator.value = true;
      else {
        playerSymbol.value = type[1];
        myTurn.value = playerSymbol.value != "X";
      }
    });
    socket.on("chatUpdate", (msg: string) => {
      chat.value.push(msg);
    });

    // send gameInfo to server
    socket.emit("gameInfo", { gameType: "tictactoe", gameId: route.params["gameid"] });
  }

  function gameStateUpdate(state: any) {
    isRunning.value = true;

    // on a gameState Update, update the board
    board.value.state = state;
    myTurn.value = !myTurn.value;
    
    checkForGameEnd();
  }

  function getFullLink(): string { return window.location.href; }

  function sendClick(x: number, y: number) {
    if (isSpectator.value) return;

    // client side prevention of clicking fields that are already filled
    if (board.value.state[x][y] != 0) return;

    // send click
    socket?.emit("makeMove", { x: x, y: y });
  }

  function checkForGameEnd() {
    let winner = 0;
    for (let i = 0; i < 3; i++) {
      if (board.value.state[i][0] == board.value.state[i][1] && board.value.state[i][1] == board.value.state[i][2] && board.value.state[i][0] != 0) {
        winner = board.value.state[i][0];
        highlightMatrix.value.state[i][0] = 1;
        highlightMatrix.value.state[i][1] = 1;
        highlightMatrix.value.state[i][2] = 1;
      }
      if (board.value.state[0][i] == board.value.state[1][i] && board.value.state[1][i] == board.value.state[2][i] && board.value.state[0][i] != 0) {
        winner = board.value.state[0][i];
        highlightMatrix.value.state[0][i] = 1;
        highlightMatrix.value.state[1][i] = 1;
        highlightMatrix.value.state[2][i] = 1;
      }
    }
    if (board.value.state[0][0] == board.value.state[1][1] && board.value.state[1][1] == board.value.state[2][2] && board.value.state[0][0] != 0) {
      winner = board.value.state[0][0];
      highlightMatrix.value.state[0][0] = 1;
      highlightMatrix.value.state[1][1] = 1;
      highlightMatrix.value.state[2][2] = 1;
    }
    if (board.value.state[0][2] == board.value.state[1][1] && board.value.state[1][1] == board.value.state[2][0] && board.value.state[0][2] != 0) {
      winner = board.value.state[0][2];
      highlightMatrix.value.state[0][2] = 1;
      highlightMatrix.value.state[1][1] = 1;
      highlightMatrix.value.state[2][0] = 1;
    }

    if (winner != 0) {
      gameWinner.value = winner == 1 ? "X" : "O";
    } else {
      let draw: boolean = true;
      board.value.state.forEach((row: Array<number>) => {
        row.forEach((column: number) => {
          if (column == 0) {
            draw = false;
          }
        })
      });
      if (draw) {
        gameWinner.value = "draw";
      }
    }
  }

  async function playAgain() {
    let currentUrl: string = route.params["gameid"] as string;
    const shuffle = "fU1rR3QCDteqJbZ7iucTzGFaApgsO9YKHEwoyMk5lWIv2nS8P6LNX4BVxmd0jh";
    let newId = "";
    currentUrl.split('').forEach((char: string) => {
      newId += shuffle[(shuffle.indexOf(char) + 1) % 62];
    });

    currentRouter.replace("/tictactoe/" + newId);
    await new Promise(f => setTimeout(f, 1));
    location.reload();
  }
</script>

<template>
  <div class="bg-gray-300 h-full">
    <div v-if="isSpectator" class="flex w-full justify-center">
      <span class="text-3xl underline">You are Spectating the Game</span>
    </div>
    <div v-if="playerSymbol != '' && gameWinner == '' && isRunning" class="flex w-full justify-center">
      <span class="text-3xl underline">You are Player {{playerSymbol}}</span>
    </div>
    <div v-if="gameWinner != '' && gameWinner != 'draw'" class="flex w-full justify-center">
      <span class="text-3xl underline">Player {{gameWinner}} won!</span>
    </div>
    <div v-if="gameWinner == 'draw'" class="flex w-full justify-center">
      <span class="text-3xl underline">Draw!</span>
    </div>
    <div v-if="playerSymbol != '' && gameWinner == '' && isRunning" class="flex w-full justify-center">
      <span v-if="myTurn" class="text-3xl underline">Your turn</span>
      <span v-if="!myTurn" class="text-3xl underline">Opponents turn</span>
    </div>

    <div v-if="!isRunning" class="bg-white p-6 rounded-lg shadow-md my-4 mx-16 flex flex-col">
      <h2 class="text-2xl font-bold mb-4">Share this link with your friends</h2>
      <p @click="() => { copyToClipboard(getFullLink(), false); copied = true}" class="mt-4 text-blue-400 flex hover:cursor-pointer">
        {{ getFullLink() }}
      </p>
      <p v-if="copied" class="text-green-500">
        Sucessfully copied
      </p>
      <p class="mt-4">
        Once a player joins, the game will start automatically.
      </p>
      <QrcodeSvg :value="getFullLink()" class="aspect-square w-32 h-32 lg:w-64 lg:h-64 mt-4"/>
    </div>
    <div v-if="isRunning" class="flex w-full justify-center items-center flex-col mb-2 mt-2 space-y-1 lg:space-y-3">
      <div v-for="(row, row_index) in board.state" class="w-full flex justify-center space-x-1 lg:space-x-3">
        <Field  v-for="(column, column_index) in row" 
                :highlighted="highlightMatrix.state[row_index][column_index] == 1" 
                :value="column" 
                @click="() => sendClick(row_index, column_index)"/>
      </div>
    </div>
    <div v-if="gameWinner != ''" class="flex justify-center items-center mb-4">
      <SimpleButton @click="playAgain">
        Click here to play again!
      </SimpleButton>
    </div>
    
    <Chatbox v-if="isRunning">
      <ChatMessage v-for='message in chat' :message='message'/>
    </Chatbox>
  </div>
</template>
