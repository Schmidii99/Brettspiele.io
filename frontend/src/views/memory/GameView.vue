<script setup lang="ts">
  import { generateRandomString, getFullLink } from '@/lib/helper'
  import LinkDisplay from '@/components/games/LinkDisplay.vue'
  import SimpleButton from '@/components/SimpleButton.vue'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { MAX_GAME_ID_LEN } from '@/config'
  import { openSocket } from '@/lib/socketManager'
  import { useRoute, useRouter } from 'vue-router'
  import type { Socket } from 'socket.io-client'

  const route = useRoute()
  const currentRouter = useRouter()
  // css properties for different board sizes
  const widths = {6: "w-24", 8: "w-20", 10: "w-16"}
  // represents side length of board
  const n = ref(8);
  const isRunning = ref(false);
  let socket: null | Socket;
  const myTurn = ref(false);
  const isSpectator = ref(false);
  const playerSymbol = ref('');
  const gameWinner = ref(0);
  const board = ref({
    state: Array.from({ length: n.value * n.value }, () => 0),
  })

  onMounted(async () => {
    // validate game id
    const gameId: string = route.params['gameid'] as string
    if (
      gameId.length > MAX_GAME_ID_LEN ||
      (gameId.match(/[^a-zA-Z\d\s:]/g) || []).length != 0
    ) {
      currentRouter.replace('/memory/' + generateRandomString(MAX_GAME_ID_LEN))
      await new Promise(f => setTimeout(f, 1))
      location.reload()
    } else {
      socket = openSocket(afterConnect)
    }
  });

  onUnmounted(() => {
    socket?.disconnect();
  });

  function afterConnect() {
    if (socket == null) return

    // listen to events
    socket.on('gameStateUpdate', gameStateUpdate);
    socket.on('playerType', (type: Array<string>) => {
      if (type[0] == 'spectator') isSpectator.value = true
      else {
        playerSymbol.value = type[1];
        myTurn.value = playerSymbol.value != 'X';
      }
    });

    // send gameInfo to server
    socket.emit('gameInfo', {
      gameType: 'memory',
      gameId: route.params['gameid'],
    });
  }

  function gameStateUpdate(state: Array<Array<number>>) {
    isRunning.value = true;
    console.log('gameStateUpdate', state);
  }
</script>

<template>
  <div class="flex flex-col justify-center">
    <LinkDisplay v-if="!isRunning" :full-link="getFullLink()" />

    <div v-if="!isRunning" class="flex items-center justify-center space-x-1 lg:space-x-3">
      <span>Choose a board size:</span>
      <SimpleButton @click="() => {n = 6}"><span :class="n == 6 ? 'text-amber-400' : ''">6x6</span></SimpleButton>
      <SimpleButton @click="() => {n = 8}"><span :class="n == 8 ? 'text-amber-400' : ''">8x8</span></SimpleButton>
      <SimpleButton @click="() => {n = 10}"><span :class="n == 10 ? 'text-amber-400' : ''">10x10</span></SimpleButton>
    </div>

    <div v-if="isRunning" class="flex flex-col space-y-2 m-4">
      <div v-for="i in n" :key="i" class="flex items-center justify-center w-full space-x-2">
        <img v-for="j in n"
             :key="j"
             src="@/assets/pattern.jpg"
             :class="'aspect-square hover:cursor-pointer hover:scale-110 ' + widths[n]"
             alt="card" />
        <span>{{i - 1}}</span>
      </div>
    </div>
  </div>
  </template>
