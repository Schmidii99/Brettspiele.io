<script setup lang="ts">
import GameChip from './GameChip.vue';

defineProps({ board: Array<Array<number>>, onClick: Function });

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
  <div v-if="board" class="flex flex-row bg-gray-500 w-fit rounded-2xl p-4">
    <div  v-for="c, c_index in (board[0] || []).length" 
          :key="c_index" 
          @click="onClick!(c_index)"
          class="hover:cursor-pointer"
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
</template>
