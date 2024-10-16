<script setup lang="ts">
  import NavbarElement from "@/components/NavbarElement.vue";
  import router from "@/router";
</script>

<template>
  <header class="bg-blue-400 flex w-full p-4 space-x-4">
      <NavbarElement class="p-2 hover:underline"
                     :link="route.path.split(':')[0]"
                     :title="route.name"
                     v-for="route in router.getRoutes().filter((r) => r.path.indexOf(':') == -1).sort((a, b) => a.name.localeCompare(b.name))"
      />
  </header>
</template>
