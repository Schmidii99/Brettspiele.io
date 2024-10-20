<script setup lang="ts">
  import {onMounted, onUnmounted} from "vue";
  import {openSocket} from "@/lib/socketManager";
  import {copyToClipboard} from "@/lib/helper";
  import {Socket} from "socket.io-client";
  import {useRoute} from "vue-router";

  let socket: null | Socket;
  let route = useRoute();
  let isRunning = false;

  onMounted(() => {
    socket = openSocket(afterConnect);
  });

  onUnmounted(() => {
    socket?.disconnect();
  });

  function afterConnect() {
    if (socket == null)
      return;

    // send gameInfo to server
    socket.emit("gameInfo", { gameType: "tictactoe", gameId: route.params["gameid"] });
  }

  function getFullLink(): string { return window.location.href; }
</script>

<template>
  <div>
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
    <div v-if="isRunning">
      <span>game is running</span>
    </div>
  </div>
</template>
