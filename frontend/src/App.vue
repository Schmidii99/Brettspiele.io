<script setup >
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useSessionStore } from './stores/sessionStore'
import { generateUUID } from './lib/helper'
import Navbar from '@/components/Navbar.vue'

onMounted(() => {
  const store = useSessionStore()
  // initialize session cookie
  if (store.session === '') {
    store.session = generateUUID()
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <Navbar />
    <RouterView />
  </div>
</template>
