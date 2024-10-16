<script setup lang="ts">
  import {openSocket} from "@/lib/socketManager";
  import {onMounted, onUnmounted} from "vue";

  let socket;

  onMounted(() => {
    socket = openSocket(onConnect);
  });

  onUnmounted(() => {
    socket.disconnect();
  })

  function onConnect() {
    console.log("I am the homeview")
  }
</script>

<template>
  <div class="flex h-full w-full justify-between items-center">
    <span class="underline text-red-400 text-7xl">Home View</span>
  </div>
</template>
