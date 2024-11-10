import {io} from "socket.io-client";
import {SOCKET_SERVER_PORT } from "@/config";
import {useSessionStore} from "@/stores/sessionStore";

export function openSocket(url: string, onConnect = () => {}, onDisconnect = () => {}) {
  const sessionStore = useSessionStore();

  const socket = io((url + ":" + SOCKET_SERVER_PORT), {
    extraHeaders: {
      "x-session": sessionStore.session,
    },
    secure: true
  });

  socket.on("connect", () => { onConnect(); });
  socket.on("disconnect", () => { onDisconnect(); });

  return socket;
}


