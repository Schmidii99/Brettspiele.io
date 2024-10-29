import {io} from "socket.io-client";
import {SOCKET_SERVER_URL} from "@/config";
import {useSessionStore} from "@/stores/sessionStore";

export function openSocket(onConnect = () => {}, onDisconnect = () => {}) {
  const sessionStore = useSessionStore();

  const socket = io((SOCKET_SERVER_URL), {
    extraHeaders: {
      "x-session": sessionStore.session,
    }
  });

  socket.on("connect", () => { onConnect(); });
  socket.on("disconnect", () => { onDisconnect(); });

  return socket;
}


