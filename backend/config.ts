export const FRONTEND_SERVER = "*";
export const SERVER_PORT = 8080;
export const REDIS_URL = Deno.env.get("REDIS_URL") ?? "redis://localhost:6379";
export const LOG_PATH = "./backend.log";
