<script setup lang="ts">
    defineProps({playerSymbol: String, gameWinner: String, isRunning: Boolean, isSpectator: Boolean, myTurn: Boolean});
</script>

<template>
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
</template>