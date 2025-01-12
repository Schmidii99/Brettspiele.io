<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col w-full h-full items-center justify-center">
    <!-- Visible part -->
    <div class="bg-gray-600 w-2 h-1/2 rounded"></div>
    <!-- Invisible part -->
    <div class="h-1/2"></div>
  </div>
</template>

<style scoped>
.spin {
  -webkit-animation:spin 2s linear infinite;
  -moz-animation:spin 2s linear infinite;
  animation:spin 2s linear infinite;
}
@-moz-keyframes spin {
  100% { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform:rotate(360deg);
  }
}
</style>
