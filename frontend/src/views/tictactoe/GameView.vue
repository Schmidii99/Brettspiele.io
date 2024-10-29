<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from "vue";
  import { openSocket } from "@/lib/socketManager";
  import { copyToClipboard } from "@/lib/helper";
  import { Socket } from "socket.io-client";
  import { useRoute} from "vue-router";
  import Field from "@/components/tictactoe/Field.vue";

  let socket: null | Socket;
  let route = useRoute();
  let isRunning = ref(false);

  let board = ref({state: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]});
  let isSpectator = ref(false);
  let playerSymbol = ref("");
  let gameWinner = ref("");

  let chat = ref([]);

  onMounted(() => {
    socket = openSocket(afterConnect);
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
      console.log(type);
      if (type[0] == "spectator")
        isSpectator.value = true;
      else {
        playerSymbol.value = type[1];
      }
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
  <div>
    <div v-if="isSpectator" class="flex w-full justify-center">
      <span class="text-3xl underline">You are Spectating the Game</span>
    </div>
    <div v-if="playerSymbol != '' && gameWinner == ''" class="flex w-full justify-center">
      <span class="text-3xl underline">You are Player {{playerSymbol}}</span>
    </div>
    <div v-if="gameWinner != '' && gameWinner != 'draw'" class="flex w-full justify-center">
      <span class="text-3xl underline">Player {{gameWinner}} won!</span>
    </div>
    <div v-if="gameWinner == 'draw'" class="flex w-full justify-center">
      <span class="text-3xl underline">Draw!</span>
    </div>
    <div v-if="!isRunning" class="absolute flex items-center justify-center h-full w-full bg-gray-500 bg-opacity-75">
      <div class="bg-white w-1/5 h-3/4 flex flex-col">
        <span>
          Invite your friend:
        </span>
        <span @click="copyToClipboard(getFullLink())" class="font-bold hover:cursor-pointer">
          Link: {{getFullLink()}}
        </span>
      </div>
    </div>
    <div v-if="isRunning" class="flex w-full justify-center items-center flex-col">
      <div v-for="(row, row_index) in board.state" class="w-full my-3 flex justify-center space-x-3">
        <Field v-for="(column, column_index) in row" :value="column" @click="() => sendClick(row_index, column_index)"/>
      </div>
    </div>
  </div>
</template>
