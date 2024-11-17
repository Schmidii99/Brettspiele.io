<script setup lang="ts">
import InfoDisplay from '@/components/games/InfoDisplay.vue'
import LinkDisplay from '@/components/games/LinkDisplay.vue'
import SimpleButton from '@/components/SimpleButton.vue'
import GameBoard from '@/components/connect4/GameBoard.vue'
import { MAX_GAME_ID_LEN } from '@/config'
import { generateRandomString, getFullLink } from '@/lib/helper'
import { openSocket } from '@/lib/socketManager'
import type { Socket } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Chatbox from '@/components/games/Chatbox.vue'
import ChatMessage from '@/components/games/ChatMessage.vue'
import dropSfx from '@/assets/audio/chipdrop.mp3'

const chipDrop = new Audio(dropSfx)

const route = useRoute()
const currentRouter = useRouter()
let socket: null | Socket
const isRunning = ref(false)
const myTurn = ref(false)
const isSpectator = ref(false)
const playerSymbol = ref('')
const gameWinner = ref(0)
const chat = ref(['Welcome to Connect Four!'])
const board = ref({
  state: Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0)),
})
const isSoundEnabled = ref(false)

onMounted(async () => {
  // validate game id
  const gameId: string = route.params['gameid'] as string
  if (
    gameId.length > MAX_GAME_ID_LEN ||
    (gameId.match(/[^a-zA-Z\d\s:]/g) || []).length != 0
  ) {
    currentRouter.replace('/connect4/' + generateRandomString(MAX_GAME_ID_LEN))
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
      myTurn.value = playerSymbol.value != 'X'
    }
  })
  socket.on('chatUpdate', (msg: string) => {
    chat.value.push(msg)
  })

  // send gameInfo to server
  socket.emit('gameInfo', {
    gameType: 'connect4',
    gameId: route.params['gameid'],
  })
}

function gameStateUpdate(state: Array<Array<number>>) {
  isRunning.value = true

  // find different indicies
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[0].length; j++) {
      if (state[i][j] != board.value.state[i][j]) {
        gameWinner.value = checkForWin(i, j, state)
        if (isSoundEnabled.value) chipDrop.play()
        break
      }
    }
  }

  // on a gameState Update, update the board
  board.value.state = state
  myTurn.value = !myTurn.value
}

function sendClick(column: number) {
  if (isSpectator.value) return

  // client side prevention of clicking fields that are already filled
  if (board.value.state[0][column] != 0) return

  // send click
  socket?.emit('makeMove', { column: column })
}

async function playAgain() {
  const currentId: string = route.params['gameid'] as string
  const shuffle =
    'U3aKnzEYf6LGO9lB128oy4DZv7cJeNkdXsphRwSxgImMA5FtTVqHiQPjuC0Wbr'
  let newId = ''
  currentId.split('').forEach((char: string) => {
    newId += shuffle[(shuffle.indexOf(char) + 1) % 62]
  })

  currentRouter.replace('/tictactoe/' + newId)
  await new Promise(f => setTimeout(f, 1))
  location.reload()
}

function checkForWin(
  row: number,
  column: number,
  board: Array<Array<number>>,
): number {
  // check row
  let count = 0
  let current_player = board[row][0]
  for (let i = 0; i < board[row].length; i++) {
    if (board[row][i] != current_player) {
      count = 1
      current_player = board[row][i]
    } else if (board[row][i] != 0) {
      count++
    }

    if (count == 4) {
      return current_player
    }
  }
  count = 0
  current_player = board[0][column]
  // check column
  for (let i = 0; i < board.length; i++) {
    if (board[i][column] != current_player) {
      count = 1
      current_player = board[i][column]
    } else if (board[i][column] != 0) {
      count++
    }

    if (count == 4) {
      return current_player
    }
  }

  // check left down to right up
  const steps_to_left_down = Math.min(6 - (row + 1), column)
  const steps_to_right_up = Math.min(row, 6 - column)

  count = 0
  current_player = board[row + steps_to_left_down][column - steps_to_left_down]
  for (let i = 0; i < steps_to_left_down + steps_to_right_up + 1; i++) {
    if (
      board[row + steps_to_left_down - i][column - steps_to_left_down + i] !=
      current_player
    ) {
      count = 1
      current_player =
        board[row + steps_to_left_down - i][column - steps_to_left_down + i]
    } else if (
      board[row + steps_to_left_down - i][column - steps_to_left_down + i] != 0
    ) {
      count++
    }

    if (count == 4) {
      return current_player
    }
  }

  // check left up to right down
  const steps_to_left_up = Math.min(row, column)
  const steps_to_right_down = Math.min(5 - row, 6 - column)

  count = 0
  current_player = board[row - steps_to_left_up][column - steps_to_left_up]
  for (let i = 0; i < steps_to_left_up + steps_to_right_down + 1; i++) {
    const currentValue =
      board[row - steps_to_left_up + i][column - steps_to_left_up + i]
    if (currentValue != current_player) {
      count = 1
      current_player = currentValue
    } else if (currentValue != 0) {
      count++
    }

    if (count == 4) {
      return current_player
    }
  }
  return 0
}
</script>

<template>
  <div class="flex flex-col justify-center">
    <!-- Poker Chip Drop by Za-Games -- https://freesound.org/s/540369/ -- License: Creative Commons 0 -->
    <InfoDisplay
      :is-running="isRunning"
      :is-spectator="isSpectator"
      :player-symbol="playerSymbol"
      :game-winner="gameWinner == 1 ? 'Red' : gameWinner == 2 ? 'Blue' : ''"
      :my-turn="myTurn"
    />

    <LinkDisplay v-if="!isRunning" :full-link="getFullLink()" />

    <div class="flex justify-center my-4">
      <GameBoard v-if="isRunning" :board="board.state" :onClick="sendClick" />
    </div>

    <div v-if="gameWinner != 0" class="flex justify-center items-center mb-4">
      <SimpleButton @click="playAgain">
        Click here to play again!
      </SimpleButton>
    </div>

    <div v-if="isRunning" class="flex flex-row justify-center items-center">
      <span class="text-xl mr-2">Sound: </span>
      <svg
        v-if="isSoundEnabled"
        @click="isSoundEnabled = !isSoundEnabled"
        class="w-8 hover:cursor-pointer"
        viewBox="-0.5 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M12.5493 4.50005C11.3193 4.04005 8.70926 5.49996 6.54926 7.40996H4.94922C3.88835 7.40996 2.87093 7.83145 2.12079 8.58159C1.37064 9.33174 0.949219 10.3491 0.949219 11.41V13.41C0.949219 14.4708 1.37064 15.4883 2.12079 16.2385C2.87093 16.9886 3.88835 17.41 4.94922 17.41H6.54926C8.65926 19.35 11.2693 20.78 12.5493 20.33C14.6493 19.55 14.9992 15.33 14.9992 12.41C14.9992 9.48996 14.6493 5.28005 12.5493 4.50005Z"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M20.6602 6.71997C22.1593 8.22011 23.0015 10.2542 23.0015 12.375C23.0015 14.4958 22.1593 16.5299 20.6602 18.03"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M18.5391 15.95C19.4764 15.0123 20.003 13.7407 20.003 12.4149C20.003 11.0891 19.4764 9.81764 18.5391 8.88"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
      <svg
        v-if="!isSoundEnabled"
        @click="isSoundEnabled = !isSoundEnabled"
        class="w-8 hover:cursor-pointer"
        viewBox="-0.5 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M10.9395 17.72C12.9395 19.5 15.3895 20.72 16.5495 20.33C18.6495 19.55 18.9995 15.3299 18.9995 12.4099C18.9995 11.5999 18.9995 10.68 18.8895 9.77002"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M18.1292 6.28008C18.0012 5.89129 17.795 5.53273 17.5233 5.22661C17.2516 4.9205 16.9201 4.67327 16.5493 4.50005C15.3193 4.04005 12.7093 5.49996 10.5493 7.40996H8.94922C7.88835 7.40996 6.87093 7.83145 6.12079 8.58159C5.37064 9.33174 4.94922 10.3491 4.94922 11.41V13.41C4.9489 14.1811 5.17151 14.936 5.59021 15.5835C6.00892 16.2311 6.60585 16.7438 7.3092 17.06"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M22 2.42004L2 22.42"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    </div>

    <Chatbox v-if="isRunning">
      <ChatMessage
        v-for="(message, m_index) in chat"
        :message="message"
        :key="m_index"
      />
    </Chatbox>
  </div>
</template>
