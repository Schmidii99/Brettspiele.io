<script setup lang="ts">
import { filename } from 'pathe/utils';

defineProps<{
  size: string,
  imgNum: string,
  highlighted: boolean
}>();

const glob = import.meta.glob('@/assets/memory/images/*.webp', { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);

function flip() {
  if (document.getElementById("card").classList.contains("rotated")) {
    document.getElementById("card").classList.remove("rotated");
  } else {
    document.getElementById("card").classList.add("rotated");
  }
}
// exposes the flip function to parent components
defineExpose({flip});
</script>

<template>
  <div :class="'bg-transparent flip-card aspect-square hover:cursor-pointer hover:scale-110 '
               + size + (highlighted ? ' highlighted' : '')"
       id="card"

  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="@/assets/pattern.jpg" alt="Avatar" :class="size + ' aspect-square'" />
      </div>
      <div class="flip-card-back">
        <img :src="images[imgNum]" alt="image" :class="size" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.rotated .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.highlighted {
  filter: brightness(65%);
}
</style>
