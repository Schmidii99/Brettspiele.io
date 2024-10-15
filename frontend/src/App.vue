<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div>

      <div>
        <span>Main</span>
      </div>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/tictactoe/123">Tac Tac Toe</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
