import { Application } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { EnvConfig } from '../config/EnvConfig';
import { Logger } from '../config/Logger';
import { connectMongodb } from '../config/Db';

export class App {
    private app: Application;
    private server: HttpServer;
    private logger: Logger;
    private env: EnvConfig;

    constructor(app: Application) {
        this.app = app;
        this.server = createServer(this.app);
        this.logger = new Logger();
        this.env = new EnvConfig();
    }

    public async initServer(): Promise<void> {
        try {
            const port = this.env.envInit().PORT;

            this.server.timeout = 30000; 
            this.server.keepAliveTimeout = 65000; 
            this.server.headersTimeout = 66000;
            

            await connectMongodb();

            await this.startServer(port);


        } catch (error) {
            this.logger.error(`Failed to initialize server:${error}`);
            throw error;
        }
    }

    private startServer(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.listen(port, () => {
                this.logger.info(`🚀 Server is running on http://localhost:${port}`);
                this.logger.info(`📝 Environment: ${this.env.envInit().NODE_ENV}`);
                resolve();
            });

            this.server.on('error', (error: Error) => {
                reject(error);
            });
        });
    }

    public getServer=()=>{
        return this.server;
    }

    public async stopServer(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public getApp = () => this.app;  
}
