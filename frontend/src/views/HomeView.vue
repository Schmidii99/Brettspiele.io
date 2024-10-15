<script setup lang="ts">
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
  <div><span>Home View</span></div>
</template>
