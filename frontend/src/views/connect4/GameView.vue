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
import Chatbox from '@/components/Chatbox.vue'
import ChatMessage from '@/components/ChatMessage.vue'

const route = useRoute();
const currentRouter = useRouter();
let socket: null | Socket;
const isRunning = ref(false);
const myTurn = ref(false);
const isSpectator = ref(false);
const playerSymbol = ref('');
const gameWinner = ref('');
const chat = ref(["Welcome to Connect Four!"]);
const board = ref({state: Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0))});

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
    isRunning.value = true;

    console.log("gameStateUpdate", state)

    // on a gameState Update, update the board
    board.value.state = state;
    myTurn.value = !myTurn.value;

    checkForGameEnd();
  }
  
  function sendClick(column: number) {
    if (isSpectator.value) return;

    // client side prevention of clicking fields that are already filled
    if (board.value.state[0][column] != 0) return;

    // send click
    socket?.emit("makeMove", { column: column });
  }

  function checkForGameEnd() {
    
  }

  async function playAgain() {
    const currentId: string = route.params["gameid"] as string;
    const shuffle = "U3aKnzEYf6LGO9lB128oy4DZv7cJeNkdXsphRwSxgImMA5FtTVqHiQPjuC0Wbr";
    let newId = "";
    currentId.split('').forEach((char: string) => {
      newId += shuffle[(shuffle.indexOf(char) + 1) % 62];
    });

    currentRouter.replace("/tictactoe/" + newId);
    await new Promise(f => setTimeout(f, 1));
    location.reload();
  }
</script>

<template>
    <InfoDisplay
        :is-running="isRunning"
        :is-spectator="isSpectator"
        :player-symbol="playerSymbol"
        :game-winner="gameWinner"
        :my-turn="myTurn"
    />

    <LinkDisplay v-if="!isRunning" :full-link="getFullLink()" />

    <div class="flex justify-center my-4">
      <GameBoard v-if="isRunning" :board="board.state" :onClick="sendClick"/>
    </div>

    <div v-if="gameWinner != ''" class="flex justify-center items-center mb-4">
      <SimpleButton @click="playAgain">
        Click here to play again!
      </SimpleButton>
    </div>

    <Chatbox v-if="isRunning">
      <ChatMessage v-for='(message, m_index) in chat' :message='message' :key="m_index"/>
    </Chatbox>
</template>
