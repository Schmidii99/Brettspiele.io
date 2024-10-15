<script setup lang="ts">
  import TheWelcome from '../components/TheWelcome.vue'
  import {openSocket} from "@/lib/socketManager";
  import {onMounted} from "vue";

  let socket;

  onMounted(() => {
    socket = openSocket(onConnect);
  });

  function onConnect() {
    console.log("I am the homeview")
  }
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
