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
  <div class="w-full h-full flex justify-center items-center m-4 flex-col space-y-5">
    <div>
      <span class="sm:text-lg lg:text-3xl text-center">Start playing Tic Tac Toe by clicking on the button below!</span>
    </div>
    <SimpleButton @click="myButtonClick">
      Create new Game
    </SimpleButton>
  </div>
</template>

