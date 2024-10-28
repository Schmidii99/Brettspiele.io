<script setup lang="ts">
    const props = defineProps({ value: Number });
</script>

<template>
    <button class="aspect-square w-1/12 bg-gray-300 rounded-xl">
        <span v-if="props.value === 1">X</span>
        <span v-if="props.value === 2">O</span>
    </button>
</template>