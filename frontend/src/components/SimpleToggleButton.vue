<script setup lang="ts">
const props = defineProps({
  onClick: {
    type: Function,
  }
});

let counter = 0;
function handleClick() {
  counter++;

  if(counter % 2 == 0) {
    props.onClick();
  }
}
</script>

<template>
  <button @click="handleClick">
    <label class="relative inline-flex cursor-pointer items-center">
      <input id="switch" type="checkbox" class="peer sr-only" />
      <label for="switch" class="hidden"></label>
      <div class="peer h-6 w-11 rounded-full border bg-slate-400 after:absolute after:left-[2px] after:top-0.5 after:h-5
      after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all
      after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white
      peer-focus:ring-green-300"></div>
    </label>
  </button>
</template>

<style scoped>

</style>
