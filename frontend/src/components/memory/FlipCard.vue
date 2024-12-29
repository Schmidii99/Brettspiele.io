<script setup lang="ts">
import { filename } from 'pathe/utils';
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  size: string,
  imgNum: string,
  highlighted: boolean,
  border: "red" | "blue" | ""
}>();

const imageNumber = ref(props.imgNum);
let flipLock = false;

watch(
  () => props.imgNum,
  () => {
    console.log("imgNum changed!", props.imgNum);
    imageNumber.value = props.imgNum;
    flip();
  }
);

onMounted(async () => {
  if (props.imgNum != 0) {
    setTimeout(function(){
      flip();
    }, 300);
  }
})

const glob = import.meta.glob('@/assets/memory/images/*.webp', { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);

function flip() {
  if (flipLock) return;

  if (cardRef.value.classList.contains("rotated")) {
    cardRef.value.classList.remove("rotated");
    cardRef.value.classList.remove("custom-border-red");
    cardRef.value.classList.remove("custom-border-blue");
    cardRef.value.classList.remove("custom-border-");
  } else {
    cardRef.value.classList.add("rotated");
    console.log("setting class: custom-border-" + props.border)
    cardRef.value.classList.add("custom-border-" + props.border);
  }
}

const cardRef = ref<HTMLDivElement>(null);

async function temporaryFlip(imgNumber: number) {
  flipLock = true;
  const oldImg: number = imageNumber.value;
  imageNumber.value = imgNumber;

  if (cardRef.value.classList.contains("rotated")) {
    cardRef.value.classList.remove("rotated");
  } else {
    cardRef.value.classList.add("rotated");
  }

  setTimeout(function(){
    flipLock = false;
    flip();
    // wait a bit until backside is changed back
    setTimeout(function(){
      imageNumber.value = oldImg;
    }, 300);
  }, 3000); // time until card is flipped back
}

function isLocked() {
  return flipLock;
}
// exposes the flip function to parent components
defineExpose({flip, temporaryFlip, isLocked});
</script>

<template>
  <div :class="'bg-transparent flip-card aspect-square '
               + (imgNum == 0 ? ' hover:cursor-pointer hover:scale-110 ' : ' ')
               + size + (highlighted ? ' highlighted ' : ' ')"
       ref="cardRef"
  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="@/assets/memory/images/0.webp" alt="Avatar" class="w-full h-full" />
      </div>
      <div class="flip-card-back bg-blue">
        <img :src="images[imageNumber]" alt="image" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>

<style>
.rotated .flip-card-inner {
  transform: rotateY(180deg);
}
.custom-border-blue {
  -webkit-box-shadow: 0rem 0rem 0.5rem 0.2rem rgb(37, 99, 235,.7);
  -moz-box-shadow: 0rem 0rem 0.5rem 0.2rem rgb(37, 99, 235,.7);
  box-shadow: 0rem 0rem 0.5rem 0.2rem rgb(37, 99, 235,.7);
}
.custom-border-red {
  -webkit-box-shadow: 0rem 0rem 0.5rem 0.2rem rgb(239, 68, 68,.7);
  -moz-box-shadow: 0rem 0rem 0.5rem 0.2rem rgb(239, 68, 68,.7);
  box-shadow: 0rem 0rem 0.5rem 0.2rem rgb(239, 68, 68,.7);
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
