<script setup lang="ts">
  import TheWelcome from '../components/TheWelcome.vue'
  import {socket} from "@/socket";
  import {onMounted} from "vue";

  onMounted(() => {
    console.log("Socket is " + socket.connected ? "already connected" : " not yet connected");
  });
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
