import { io } from "socket.io-client";
import { API_URL } from "./config";
import { SessionStore } from "./stores";
import {get} from "svelte/store";

export function openSocket() {
    return io(API_URL, {
        extraHeaders: {
            "x-session": get(SessionStore),
        }
    });
}