<script setup lang="ts">
    const props = defineProps({message: String});
</script>

<template>
    <div class="flex justify-center items-center">
        <span class="bg-white px-2 py-1 rounded-lg text-lg m-1">{{ props.message }}</span>
    </div>
</template>