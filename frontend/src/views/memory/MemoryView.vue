<script setup lang="ts">
import FlipCard from '@/components/memory/FlipCard.vue'
</script>

<template>
  <h1>How to play Memory</h1>
  <button @click="$refs.myChild.flip()">Click me</button>
  <FlipCard size="w-16 h-16" img-num="8" ref="myChild"></FlipCard>
</template>
