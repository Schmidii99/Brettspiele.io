import * as log from "log";
import { LOG_PATH } from "../config.ts";

export function setupLogger(): void {
    log.setup({
        handlers: {
            console: new log.ConsoleHandler("DEBUG", {
                formatter: (record: log.LogRecord): string => `${record.datetime.toLocaleTimeString()} - ${record.levelName}: ${record.msg}`,
            }),

            file: new log.FileHandler("WARN", {
                filename: LOG_PATH,
                // you can change format of output message using any keys in `LogRecord`.
                formatter: (record: log.LogRecord): string => `[${record.datetime.toISOString()}] [${record.levelName}] ${record.msg}`,
            }),
        },
        loggers: {
            default: {
                level: "DEBUG",
                handlers: ["console", "file"],
            },
        },
    });
}