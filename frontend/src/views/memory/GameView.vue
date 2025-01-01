<script setup lang="ts">
import { generateRandomString, getFullLink } from '@/lib/helper'
import LinkDisplay from '@/components/games/LinkDisplay.vue'
import SimpleButton from '@/components/SimpleButton.vue'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { MAX_GAME_ID_LEN } from '@/config'
import { openSocket } from '@/lib/socketManager'
import { useRoute, useRouter } from 'vue-router'
import type { Socket } from 'socket.io-client'
import FlipCard from '@/components/memory/FlipCard.vue'

const route = useRoute()
const currentRouter = useRouter()
// css properties for different board sizes
const widths = { 6: 'md:w-24 w-12', 8: 'md:w-20 w-10', 10: 'md:w-16 w-4' }
// represents side length of board
const n = ref(8)
const isRunning = ref(false)
let socket: null | Socket
const myTurn = ref(null)
const isSpectator = ref(false)
const playerSymbol = ref('')
const gameWinner = ref(0)
const scores = ref([0, 0, [], []])
const board = ref({
  state: Array.from({ length: n.value * n.value }, () => 0),
})
// all selected imgs
const highlighted = ref([])
// refs to all cards in dom
const cardRefs = useTemplateRef('cards')

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
})

onUnmounted(() => {
  socket?.disconnect()
})

function afterConnect() {
  if (socket == null) return

  // listen to events
  socket.on('gameStateUpdate', gameStateUpdate)
  socket.on('playerType', (type: Array<string>) => {
    if (type[0] == 'spectator') isSpectator.value = true
    else {
      playerSymbol.value = type[1]
      myTurn.value = playerSymbol.value == 'X'
    }
  })
  socket.on('revealCards', (args: Array<{ index: number; value: number }>) => {
    args = JSON.parse(args)
    args.forEach((el: { index: number; value: number }) => {
      revealCard(el.index, el.value)
    });
    myTurn.value = !myTurn.value;
  })

  // send gameInfo to server
  socket.emit('gameInfo', {
    gameType: 'memory',
    gameId: route.params['gameid'],
  })
}

function gameStateUpdate(update: { gameStatus: string, state: Array<number>, scores: Array<number | Array<number>>, yourTurn: boolean }) {
  // check if other size is selected
  if (update.state.length != board.value.state.length) {
    n.value = Math.sqrt(update.state.length);
    board.value.state = Array.from({ length: update.state.length }, () => 0);
  }

  if (myTurn.value == null) {
    myTurn.value = update.yourTurn;
  }

  isRunning.value = true
  for (let i = 0; i < update.state.length; i++) {
    if (board.value.state[i] != update.state[i]) {
      board.value.state[i] = update.state[i];
    }
  }

  scores.value = update.scores;
  board.value.state = update.state
  checkAndSetWinner();
}

function onClick(index: number) {
  // if is not my turn then no highlight
  if (myTurn.value == null || !myTurn.value) { return; }

  // check if card is locked (locked = temp flip currently done)
  if (cardRefs.value[index].isLocked()) {
    return;
  }

  const arrayIndex = highlighted.value.indexOf(index)
  if (arrayIndex > -1) {
    if (index !== -1) {
      highlighted.value.splice(arrayIndex, 1)
    }
  } else {
    // check if 2 are highlighted
    if (highlighted.value.length >= 1) {
      const secondIndex = highlighted.value.pop()
      sendCLick(index, secondIndex)
    } else {
      highlighted.value.push(index)
    }
  }
}

function sendCLick(index1: number, index2: number) {
  if (isSpectator.value) {
    return
  }

  // client side prevention of clicking fields that are already filled
  if (board.value.state[index1] != 0 || board.value.state[index2] != 0) {
    return
  }

  // send click
  socket?.emit('makeMove', { index1: index1, index2: index2 })
}

function changeBoardSize() {
  if (n.value != 6 && n.value != 8 && n.value != 10) {
    return
  }

  socket?.emit('changeBoardSize', { size: n.value })
}

async function revealCard(index: number, img: number) {
  // intentionally not awaited
  cardRefs.value[index].temporaryFlip(img)
}

function getBorder(index: number) {
  const value = board.value.state[index];
  if (scores.value[2].indexOf(value) != -1) {
    return "red";
  }
  if (scores.value[3].indexOf(value) != -1) {
    return "blue";
  }
  return "";
}

function checkAndSetWinner() {
  for (let i = 0; i < board.value.state.length; i++) {
    if (board.value.state[i] == 0) {
      gameWinner.value = 0;
      return;
    }
  }

  gameWinner.value = scores.value[0] > scores.value[1] ? 1 : 2;
}
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <LinkDisplay v-if="!isRunning" :full-link="getFullLink()" />
    <div v-if="isSpectator">Your are Spectating</div>
    <div v-show="!isSpectator && isRunning" class="w-full flex flex-col justify-center items-center m-1 text-2xl">
      <div class="flex justify-center items-center">
        <span class="mr-2">{{ playerSymbol == 'X' ? "Your Player " : "Your Player"}}</span>
        <span :class="playerSymbol == 'X' ? 'text-red-500' : 'text-blue-600'"
          >{{ playerSymbol == 'X' ? "Red" : "Blue"}}
        </span>
      </div>
      <span v-show="gameWinner == 0">{{ myTurn ? "Your turn!" : "Opponents turn!" }}</span>
    </div>
    <div v-show="isRunning" class="flex space-x-2 text-2xl">
      <span>Score: </span>
      <span class="text-red-500">{{scores[0]}}</span>
      <span>-</span>
      <span class="text-blue-600">{{scores[1]}}</span>
    </div>
    <div v-show="isRunning && gameWinner != 0 && !isSpectator" class="flex space-x-2 text-2xl">
      <span class="mr-2">Game over -</span>
      <span v-show="(gameWinner == 1) == (playerSymbol == 'X')" class="text-blue-600">You Won!</span>
      <span v-show="(gameWinner == 1) != (playerSymbol == 'X')" class="text-red-500">You Lost!</span>
    </div>
    <div v-if="isRunning && gameWinner != 0 && isSpectator" class="flex space-x-2 text-2xl">
      <span class="mr-2">Game over -</span>
      <span v-show="gameWinner == 2" class="text-blue-600">Blue Won!</span>
      <span v-show="gameWinner == 1" class="text-red-500">Red Won!</span>
    </div>

    <div
      v-show="!isRunning"
      class="flex md:flex-row flex-col items-center justify-center space-x-1 lg:space-x-3"
    >
      <span>Choose a board size:</span>
      <SimpleButton
        @click="
          () => {
            n = 6
            changeBoardSize()
          }
        "
        ><span :class="n == 6 ? 'text-amber-400' : ''">6x6</span></SimpleButton
      >
      <SimpleButton
        @click="
          () => {
            n = 8
            changeBoardSize()
          }
        "
        ><span :class="n == 8 ? 'text-amber-400' : ''">8x8</span></SimpleButton
      >
      <SimpleButton
        @click="
          () => {
            n = 10
            changeBoardSize()
          }
        "
        ><span :class="n == 10 ? 'text-amber-400' : ''"
          >10x10</span
        ></SimpleButton
      >
    </div>

    <div v-if="isRunning" class="flex flex-col space-y-2 m-4">
      <div
        v-for="i in n"
        :key="i"
        class="flex items-center justify-center w-full space-x-2"
      >
        <FlipCard
          v-for="j in n"
          ref="cards"
          :key="j"
          :size="widths[n]"
          :highlighted="highlighted.indexOf((i - 1) * n + j - 1) != -1"
          @click="onClick((i - 1) * n + j - 1)"
          :img-num="'' + board.state[(i - 1) * n + j - 1]"
          :border="getBorder((i - 1) * n + j - 1)"
        ></FlipCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
