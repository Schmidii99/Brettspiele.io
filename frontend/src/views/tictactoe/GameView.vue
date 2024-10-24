<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from "vue";
  import { openSocket } from "@/lib/socketManager";
  import { copyToClipboard } from "@/lib/helper";
  import { Socket } from "socket.io-client";
  import { useRoute} from "vue-router";
  import Field from "@/components/tictactoe/Field.vue";

  let socket: null | Socket;
  let route = useRoute();
  // this is correct !!! : let isRunning = ref(false);
  // this is temporary : 
  let isRunning = ref(true);

  let board: Array<Array<number>> = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let isSpectator = ref(false);
  let playerSymbol = ref("");

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
    board = state;
  }

  function getFullLink(): string { return window.location.href; }
</script>

<template>
  <div>
    <div v-if="isSpectator" class="flex w-full">
      <span class="text-3xl underline">You are Spectating the Game</span>
    </div>
    <div v-if="playerSymbol != ''" class="flex w-full">
      <span class="text-3xl underline">You are Player {{playerSymbol}}</span>
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
      <div v-for="row in board" class="w-full my-3 flex justify-center space-x-3">
        <Field v-for="column in row"/>
      </div>
    </div>
  </div>
</template>
