export const FRONTEND_SERVER = "*";
export const SERVER_PORT = 8080;
export const REDIS_URL = Deno.env.get("REDIS_URL") ?? "redis://localhost:6379";
export const LOG_PATH = "./backend.log";
export const SESSION_HEADER = "X-Session";
export const GAME_TTL_AFTER_DISCONNECT = 60;
