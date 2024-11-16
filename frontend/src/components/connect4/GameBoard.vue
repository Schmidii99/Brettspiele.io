<script setup lang="ts">
import { ref } from 'vue';
import GameChip from './GameChip.vue';

defineProps({ board: Array<Array<number>>, onClick: Function });
  const hoverArray = ref([0, 0, 0, 0, 0, 0, 0]);

function getColor(value: number): string {
  switch (value) {
    case 1:
      return 'bg-player-red';
    case 2:
      return 'bg-player-blue';
    default:
      return 'bg-white';
  }
}
</script>

<template>
  <div class="flex flex-col">
  <div class="flex flex-row p-4"> 
    <GameChip v-for="n in 7" :key="n" :class="'w-16 aspect-square mx-2 ' + (hoverArray[n - 1] == 0 ? 'invisible' : 'visible')" />
  </div>
  <div v-if="board" class="flex flex-row bg-gray-500 w-fit rounded-2xl p-4">
    <div  v-for="c, c_index in (board[0] || []).length" 
          :key="c_index" 
          @click="onClick!(c_index)"
          class="hover:cursor-pointer"
          @mouseover="hoverArray[c_index] = 1"
          @mouseleave="hoverArray[c_index] = 0"
      >
      <div
        v-for="r, r_index in board.length"
        :key="r_index + '|' + c_index"
        :class="'rounded-full aspect-square w-16 m-2 ' + getColor(board[r_index][c_index])"
      >
        <GameChip v-if="board[r_index][c_index] != 0" />
      </div>
    </div>
  </div>
  </div>
</template>
