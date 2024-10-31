<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from "vue";
  import { openSocket } from "@/lib/socketManager";
  import { copyToClipboard } from "@/lib/helper";
  import { Socket } from "socket.io-client";
  import { useRoute} from "vue-router";
  import Field from "@/components/tictactoe/Field.vue";
  import Chatbox from "@/components/Chatbox.vue";
  import ChatMessage from "@/components/ChatMessage.vue";
  import { QrcodeSvg } from "qrcode.vue";

  let socket: null | Socket;
  let route = useRoute();
  let isRunning = ref(false);
  let copied = ref(false);

  let board = ref({state: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]});
  let isSpectator = ref(false);
  let playerSymbol = ref("");
  let gameWinner = ref("");

  let chat = ref(["Welcome to TicTacToe!"]);

  onMounted(() => {
    socket = openSocket(`${location.protocol}//${location.hostname}`, afterConnect);
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
      }
      if (board.value.state[0][i] == board.value.state[1][i] && board.value.state[1][i] == board.value.state[2][i] && board.value.state[0][i] != 0) {
        winner = board.value.state[0][i];
      }
    }
    if (board.value.state[0][0] == board.value.state[1][1] && board.value.state[1][1] == board.value.state[2][2] && board.value.state[0][0] != 0) {
      winner = board.value.state[0][0];
    }
    if (board.value.state[0][2] == board.value.state[1][1] && board.value.state[1][1] == board.value.state[2][0] && board.value.state[0][2] != 0) {
      winner = board.value.state[0][2];
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
    <div v-if="isRunning" class="flex w-full justify-center items-center flex-col mb-4">
      <div v-for="(row, row_index) in board.state" class="w-full my-3 flex justify-center space-x-3">
        <Field v-for="(column, column_index) in row" :value="column" @click="() => sendClick(row_index, column_index)"/>
      </div>
    </div>
      <Chatbox v-if="isRunning">
        <ChatMessage v-for='message in chat' :message='message'/>
      </Chatbox>
  </div>
</template>
