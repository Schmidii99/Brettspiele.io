<script setup lang="ts">
  const props = defineProps({ title: String, link: String });


</script>

<template>
  <RouterLink :to="props.link">
    {{props.title}}
  </RouterLink>
</template>
