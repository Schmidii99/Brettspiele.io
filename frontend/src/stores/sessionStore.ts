import { ref } from 'vue';
import { defineStore } from 'pinia';
import { generateUUID } from "@/lib/helper";

export const useSessionStore =
  defineStore('session', () => {
    const session = ref("");
    function resetSession(): void {
      session.value = generateUUID();
    }

    return { session, resetSession };
}, {persist: true});
