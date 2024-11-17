<script setup lang="ts">
    import { copyToClipboard } from '@/lib/helper';
    import { QrcodeSvg } from 'qrcode.vue';
    import { onMounted, ref } from 'vue';

    const props = defineProps({fullLink: String});
    const copied = ref(false);
    const link = ref('');

    onMounted(() => {
      link.value = (props.fullLink || '').replace('tictactoe', 'ttt').replace('connect4', 'c4');
    });

    function onClick() {
        copyToClipboard(props.fullLink || "", false); 
        copied.value = true
    }
</script>


<template>
    <div class="bg-white p-6 rounded-lg shadow-md my-4 mx-16 flex flex-col">
      <h2 class="text-2xl font-bold mb-4">Share this link with your friends</h2>
      <p @click="onClick" class="mt-4 text-blue-400 flex hover:cursor-pointer">
        {{ link }}
      </p>
      <p v-if="copied" class="text-green-500">
        Sucessfully copied
      </p>
      <p class="mt-4">
        Once a player joins, the game will start automatically.
      </p>
      <QrcodeSvg :value="link" class="aspect-square w-32 h-32 lg:w-64 lg:h-64 mt-4"/>
    </div>
</template>