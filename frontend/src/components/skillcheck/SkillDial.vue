<script setup lang="ts">
import OuterCircle from '@/components/skillcheck/OuterCircle.vue'
import InnerCircle from '@/components/skillcheck/InnerCircle.vue'
import Pointer from '@/components/skillcheck/SkillCheckPointer.vue'
import { ref } from 'vue'
import HitZone from '@/components/skillcheck/HitZone.vue'
import { getRandomInt } from '@/lib/helper'

const pointerRef = ref(null);
const hitZoneRef = ref(null);

function startSpinning() {
  if (!pointerRef.value) { return; }

  pointerRef.value.mediumSpin();
}

function stopSpinning() {
  if (!pointerRef.value) { return; }

  pointerRef.value.stopSpin();
}

function rotateHitzoneRandom() {
  hitZoneRef.value.style["transform"] = "rotate("+ getRandomInt(165, 300) +"deg)";
}

function rotateHitzone(degree: number) {
  hitZoneRef.value.style["transform"] = "rotate("+ degree +"deg)";
}

function getHitZoneRotation(): null | number {
  if (hitZoneRef.value == null) { return null; }
  const transform: string | null = hitZoneRef.value.style["transform"];
  if (transform == null) { return null; }
  return parseInt(transform.split(")")[0].split("(")[1].split("deg")[0]);
}

defineExpose({});
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative w-80 h-80">
      <OuterCircle  class="innerOuterCircle top-0 left-0 absolute z-20" />
      <InnerCircle  class="innerOuterCircle top-0 left-0 absolute" />
      <Pointer ref="pointerRef" class="pointer pointer-shift left-0 absolute z-30 spin rotate-[270deg] " />
      <div ref="hitZoneRef" class="w-full h-full z-10">
        <HitZone class="hitzone hitzone-shift" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .innerOuterCircle {
    width: 100%;
    height: 100%;
  }
  .pointer {
    width: 100%;
    height: 60%;
  }
  .hitzone {
    width: 25.87268994%;
    height: 8.08521561%;
  }
  .hitzone-shift {
    position: absolute;
    left: 0;
    right: 0;
    margin-inline: auto;
    width: fit-content;
  }
  .pointer-shift {
    top: calc(50% - 3.6527573529%);
  }
</style>
