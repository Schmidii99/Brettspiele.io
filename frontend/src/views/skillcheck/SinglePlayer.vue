<script setup lang="ts">

import SkillDial from '@/components/skillcheck/SkillDial.vue'
import { onMounted, ref } from 'vue'
import SimpleToggleButton from '@/components/SimpleToggleButton.vue'

onMounted(() => {
  addClickListener();
  skillDialRef.value.startSpinning();
});

const spacebarActivation = ref(false);
function addClickListener() {
  addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.code === "Space" && spacebarActivation.value) {
      handleClick();
    }
  });
}

const skillDialRef = ref<HTMLDivElement>(null);
const hitCount = ref(0);
const highScore = ref(0);
let spinLock = false;
function handleClick() {
  const hit = skillDialRef.value.isPointerOnHitZone();

  if (hit == null || spinLock) { return; }

  if (hit) {
    hitCount.value++;

    if (hitCount.value > highScore.value) {
      highScore.value++;
    }

    if (hitCount.value == 3) {
      skillDialRef.value.stopSpinning();
      skillDialRef.value.startSpinning("medium");
      console.log("started medium")
    } else if (hitCount.value == 8) {
      skillDialRef.value.stopSpinning();
      skillDialRef.value.startSpinning("fast");
      console.log("started fast")
    }
    skillDialRef.value.rotateHitzoneRandom();
  } else {
    hitCount.value = 0;
    skillDialRef.value.stopSpinning();
    spinLock = true;

    setTimeout(() => {
      spinLock = false;
      skillDialRef.value.rotateHitzoneRandom();
      skillDialRef.value.startSpinning("slow");
    }, 3000);
  }
}
</script>

<template>
  <div class="w-full h-8 flex items-center justify-center my-4 space-x-2">
    <p class="my-auto text-lg">Switch to spacebar to activate</p>
    <SimpleToggleButton class="my-auto" :on-click="() => {spacebarActivation = !spacebarActivation;}" />
  </div>
  <div class="text-center flex w-full items-center justify-center text-3xl">Streak {{hitCount}}</div>
  <div class="text-center flex w-full items-center justify-center text-3xl">Highscore {{highScore}}</div>
  <div class="w-full h-full flex justify-center items-center hover:cursor-pointer" @click="() => {if (!spacebarActivation.value) { handleClick(); }}">
    <SkillDial ref="skillDialRef" />
  </div>
</template>

<style scoped>

</style>
