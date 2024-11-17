<script setup lang="ts">
  import SimpleButton from "@/components/SimpleButton.vue";
  import {generateRandomString} from "@/lib/helper";
  import {useRouter} from "vue-router";

  const currentRouter = useRouter();

  function myButtonClick() {
    currentRouter.push("/connect4/" + generateRandomString(6));
  }
</script>

<template>
  <div class="w-full h-full flex justify-center items-center p-4 flex-col">
    <div class="mb-5 text-center">
      <h1 class="text-5xl font-bold text-blue-800 my-4">Play Connect Four</h1>
      <p class="text-xl text-gray-600">Start playing, by clicking the button below</p>
    </div>
    <SimpleButton @click="myButtonClick">
      Create new Game
    </SimpleButton>
    <div class="bg-white p-6 rounded-lg shadow-md mt-16 flex flex-col">
      <h2 class="text-2xl font-bold mb-6">How to Play Connect Four</h2>
      <h2 class="text-lg font-bold">Game Setup</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>The game is played on a vertical grid with 6 rows and 7 columns.</li>
        <li>Players take turns dropping their colored discs into one of the seven columns.</li>
      </ol>
      <h2 class="text-lg font-bold mt-4">Gameplay</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>The disc falls to the bottommost available space in the chosen column.</li>
        <li>The objective is to connect four of your colored discs in a row, either horizontally, vertically, or diagonally.</li>
      </ol>
      <h2 class="text-lg font-bold mt-4">Winning</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>The first player to achieve a connect four wins the game.</li>
      </ol>
      <h2 class="text-lg font-bold mt-4">Draw</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>If the board fills up without a player achieving a connect four, the game ends in a draw.</li>
      </ol>
      <p class="mt-6">
        Create a game above, and you'll be redirected to a page where you can play with your friends!
      </p>
    </div>
  </div>
 
</template>