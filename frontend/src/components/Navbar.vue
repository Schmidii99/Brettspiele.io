<script setup lang="ts">
  import NavbarElement from "@/components/NavbarElement.vue";

  const routes = [
    {
      path: "/",
      name: "Home"
    },
    {
      path: "/tictactoe",
      name: "Tic Tac Toe"
    }
  ];
</script>

<template>
  <header class="bg-blue-400 flex w-full p-4 space-x-4">
      <NavbarElement class="p-2 hover:underline"
                     v-for="route in routes"
                     :link="route.path"
                     :title="route.name"
      />
  </header>
</template>
