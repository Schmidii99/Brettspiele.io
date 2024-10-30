<script setup lang="ts">

</script>

<template>
    <div class="flex flex-col bg-gray-300 rounded-2xl justify-center w-1/2 mx-auto overflow-scroll max-h-dvh">
        <div class="w-full flex justify-center">
            <span class="underline text-2xl text-center w-full">Chat</span>
        </div>
        <div class="bg-blue flex flex-col m-3 divide-y-2 divide-blue-400">
            <slot></slot>
        </div>
    </div>
</template>
