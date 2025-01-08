<script setup lang="ts">
import SimpleButton from "@/components/SimpleButton.vue";
import {generateRandomString} from "@/lib/helper";
import {useRouter} from "vue-router";

const currentRouter = useRouter();

function myButtonClick() {
  currentRouter.push("/memory/" + generateRandomString(6));
}
</script>

<template>
  <div>
  <div class="w-full h-full flex justify-center items-center p-4 flex-col overflow-auto">
    <div class="mb-5 text-center">
      <h1 class="text-5xl font-bold text-blue-800 my-4">Play Memory</h1>
      <p class="text-xl text-gray-600">Start playing, by clicking the button below</p>
    </div>
    <SimpleButton @click="myButtonClick">
      Create new Game
    </SimpleButton>
    <div class="bg-white p-6 rounded-lg shadow-md mt-16 flex flex-col overflow-auto">
      <h2 class="text-2xl font-bold mb-6">How to Play Memory</h2>
      <h2 class="text-lg font-bold">Game Setup</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>The game is played with pairs of two picture-cards.</li>
        <li>Players take turns revealing a pair.</li>
      </ol>
      <h2 class="text-lg font-bold mt-4">Gameplay</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>Once a matching pair is revealed, the player gets a point and the pair stays revealed.</li>
        <li>This player gets to choose the next pair.</li>
        <li>The objective is to reveal all cards and end the game with the higher score.</li>
      </ol>
      <h2 class="text-lg font-bold mt-4">Winning</h2>
      <ol class="list-disc list-inside space-y-2">
        <li>The player with the higher score at the end, wins the game.</li>
      </ol>
      <p class="mt-6">
        Create a game above, and you'll be redirected to a page where you can play with your friend!
      </p>
    </div>
  </div>
  </div>
</template>
