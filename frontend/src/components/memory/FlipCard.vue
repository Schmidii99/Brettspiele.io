<script setup lang="ts">
import { filename } from 'pathe/utils';
import { ref } from 'vue'

const props = defineProps<{
  size: string,
  imgNum: string,
  highlighted: boolean
}>();

const imageNumber = ref(props.imgNum);

const glob = import.meta.glob('@/assets/memory/images/*.webp', { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);

function flip() {
  console.log('flip');
  if (cardRef.value.classList.contains("rotated")) {
    cardRef.value.classList.remove("rotated");
  } else {
    cardRef.value.classList.add("rotated");
  }
}

const cardRef = ref<HTMLDivElement>(null);

async function temporaryFlip(imgNumber: number) {
  const oldImg: number = imageNumber.value;
  imageNumber.value = imgNumber;

  if (cardRef.value.classList.contains("rotated")) {
    cardRef.value.classList.remove("rotated");
  } else {
    cardRef.value.classList.add("rotated");
  }

  setTimeout(function(){
    flip();
    // wait a bit until backside is changed back
    setTimeout(function(){
      imageNumber.value = oldImg;
    }, 300);
  }, 3000); // time until card is flipped back
}
// exposes the flip function to parent components
defineExpose({flip, temporaryFlip});
</script>

<template>
  <div :class="'bg-transparent flip-card aspect-square hover:cursor-pointer hover:scale-110 '
               + size + (highlighted ? ' highlighted' : '')"
       ref="cardRef"

  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="@/assets/memory/images/0.webp" alt="Avatar" :class="size + ' aspect-square'" />
      </div>
      <div class="flip-card-back">
        <img :src="images[imageNumber]" alt="image" :class="size" />
      </div>
    </div>
  </div>
</template>

<style>
.rotated .flip-card-inner {
  transform: rotateY(180deg);
}
</style>

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
