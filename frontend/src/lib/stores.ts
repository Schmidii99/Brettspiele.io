import {type Writable, writable} from "svelte/store";
import {generateUUID} from "$lib/helper";
import {Socket} from "socket.io-client";

export const SessionStore: Writable<string> = writable<string>(generateUUID());
export const SocketStore = writable<Socket>();