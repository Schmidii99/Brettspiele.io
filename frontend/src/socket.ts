import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false
});


const URL = "http://localhost:8080";

export const socket = io(URL, {
  extraHeaders: {
    "x-session": generateUUID(),
  }
});

socket.on("connect", () => {
  state.connected = true;
  console.log("Connected!");
});

socket.on("disconnect", () => {
  state.connected = false;
});

export function generateUUID(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
