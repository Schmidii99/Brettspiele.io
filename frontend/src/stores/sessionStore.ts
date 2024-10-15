import { ref } from 'vue'
import { defineStore } from 'pinia'
import { generateUUID } from "@/lib/helper";

export const useSessionStore = defineStore('sessionStore', () => {
  const session = ref(generateUUID())
  function resetSession() {
    count.value++
  }

  return { session, resetSession }
})
