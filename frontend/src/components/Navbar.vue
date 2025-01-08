<script setup>
  import { ref } from 'vue'

  const menuOpen = ref(false);
  const links = ref(null);

  function triggerMenu() {
    menuOpen.value = !menuOpen.value;
    if (links.value == null) return;
    if (links.value.classList.contains('hidden')) {
      links.value.classList.remove('hidden');
    } else {
      links.value.classList.add('hidden');
    }
  }
</script>

<template>
  <nav class="bg-blue-700 text-white px-4 py-2 md:py-4 w-full">
        <div class="w-full flex justify-between items-center">
            <a v-show="!menuOpen" href="/" class="text-2xl font-bold">BoardGames Live 🎲</a>
            <div ref="links" class="md:block hidden space-x-4">
                <a href="/tictactoe" class="hover:text-blue-300">Tictactoe</a>
                <a href="/connect4" class="hover:text-blue-300">Connect-Four</a>
                <a href="/memory" class="hover:text-blue-300">Memory</a>
                <a href="/about" class="hover:text-blue-300">About</a>
            </div>
            <div class="block md:hidden text-white text-4xl cursor-pointer"
                 @click="triggerMenu">
              <span>≡</span>
            </div>
        </div>
    </nav>
</template>
