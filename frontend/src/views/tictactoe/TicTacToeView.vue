<script setup lang="ts">
  import SimpleButton from "@/components/SimpleButton.vue";
  import {generateRandomString} from "@/lib/helper";
  import {useRouter} from "vue-router";

  const currentRouter = useRouter();

  function myButtonClick() {
    currentRouter.push("/tictactoe/" + generateRandomString(6));
  }
</script>

<template>
  <div>
  <div class="w-full h-full flex justify-center items-center p-4 flex-col">
    <div class="mb-5 text-center">
      <h1 class="text-5xl font-bold text-blue-800 my-4">Play Tic Tac Toe</h1>
      <p class="text-xl text-gray-600">Start playing, by clicking the button below</p>
    </div>
    <SimpleButton @click="myButtonClick">
      Create new Game
    </SimpleButton>
    <div class="bg-white p-6 rounded-lg shadow-md mt-16 flex flex-col">
      <h2 class="text-2xl font-bold mb-4">How to Play Tic Tac Toe</h2>
      <ol class="list-decimal list-inside space-y-2">
        <li>The game is played on a 3x3 grid.</li>
        <li>Players take turns placing their symbol (X or O) in empty cells.</li>
        <li>The first player to get 3 of their symbols in a row (horizontally, vertically, or diagonally) wins.</li>
        <li>If all cells are filled and no player has won, the game is a draw.</li>
      </ol>
      <p class="mt-4">
        Create a game above, and you'll be redirected to a page where you can play with your friends!
      </p>
    </div>
  </div>
  </div>
</template>

