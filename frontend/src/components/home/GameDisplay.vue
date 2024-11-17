<script setup lang="ts">
    import { generateRandomString } from '@/lib/helper';
    import { useRouter } from 'vue-router';

    const currentRouter = useRouter();

    const props = defineProps({ title: String, description: String, baseLink: String, disabled: Boolean });

    function redirect() {
        currentRouter.push(props.baseLink + generateRandomString(6));
    }
</script>

<template>
    <div class="bg-white p-6 rounded-lg shadow-md hover:scale-105">
        <div class="text-4xl mb-4">
            <slot class="w-10 aspect-square" name="icon"></slot>
        </div>
        <h3 class="text-xl font-bold mb-2">{{ title }}</h3>
        <p class="text-gray-600">{{ description }}</p>
        <button v-if="!disabled" @click="() => redirect()" class="mt-3 inline-block bg-blue-500 border-blue-500 border-2 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            Play Now
        </button>
        <a v-if="!disabled" href="/connect4" 
            class="ml-2 mt-3 inline-block bg-white border-blue-500 border-2 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            How To Play
        </a>
        <button v-if="disabled" disabled class="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg cursor-not-allowed mt-9">
            Coming Soon
        </button>
    </div>
</template>