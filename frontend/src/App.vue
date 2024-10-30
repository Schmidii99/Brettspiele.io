<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import { onMounted } from 'vue';
import { useSessionStore } from './stores/sessionStore';
import { generateUUID } from './lib/helper';

onMounted(() => {
  let store = useSessionStore();
  // initialize session cookie
  if (store.session === "") {
    store.session = generateUUID();
  }
})
</script>

<template>
  <div class="flex flex-col">
    <Navbar />
    <RouterView />
  </div>
</template>
