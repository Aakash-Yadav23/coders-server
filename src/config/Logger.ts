import path from 'path';
import fs from 'fs';
import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';
import { StreamOptions } from 'morgan';

interface ILogs {
    type: "ERROR" | "SUCCESS" | "INFO";
    message: string;
}

export class Logger {
    private logger: WinstonLogger;

    constructor() {
        const logDir = path.join(__dirname, '../../logs');
        this.ensureLogDirectoryExists(logDir);

        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`)
            ),
            defaultMeta: { service: "User_service" },
            transports: [
                new transports.Console({
                    format: format.combine(format.colorize(), format.simple())
                }),
                new transports.File({
                    filename: path.join(logDir, `${new Date().toISOString().split("T")[0]}-logs.log`),
                    level: 'info',
                    maxsize: 5 * 1024 * 1024,  // 5MB
                    maxFiles: 10,
                    tailable: true,
                })
            ]
        });
    }

    private ensureLogDirectoryExists(logDir: string) {
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public success(message: string): void {
        this.logger.info(`SUCCESS: ${message}`);
    }

    public error(message: string): void {
        this.logger.error(`ERROR: ${message}`);
    }

    public log(type: ILogs['type'], message: string): void {
        switch (type) {
            case "ERROR":
                this.error(message);
                break;
            case "SUCCESS":
                this.success(message);
                break;
            case "INFO":
            default:
                this.info(message);
                break;
        }
    }

    // Create a stream for Morgan to use Winston
    public getMorganStream(): StreamOptions {
        return {
            write: (message: string) => {
                this.info(message.trim());
            },
        };
    }
}
