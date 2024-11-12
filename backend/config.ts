export const FRONTEND_SERVER = Deno.env.get("ORIGIN") ?? "*";
export const SERVER_PORT = 8080;
export const REDIS_URL = Deno.env.get("REDIS_URL") ?? "redis://localhost:6379";
export const LOG_PATH = "./backend.log";
export const SESSION_HEADER = "X-Session";
export const GAME_TTL_AFTER_DISCONNECT = 60;
export const MAX_MESSAGE_LEN = 64;
export const MAX_GAME_ID_LEN = 6;
