import {io} from "socket.io-client";
import {SOCKET_SERVER_PATH } from "@/config";
import {useSessionStore} from "@/stores/sessionStore";

export function openSocket(onConnect = () => {}, onDisconnect = () => {}) {
  const sessionStore = useSessionStore();

  const protocol: string = import.meta.env.VITE_SOCKET_PROTOCOL || "wss://";

  const socket = io(protocol + location.hostname, {
    path: SOCKET_SERVER_PATH,
    extraHeaders: {
      "x-session": sessionStore.session,
    },
    secure: true
  });

  socket.on("connect", () => { onConnect(); });
  socket.on("disconnect", () => { onDisconnect(); });

  return socket;
}


