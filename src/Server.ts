import cluster from 'cluster';
import os from 'os';
import { App } from './Providers/App';
import { Express } from './Providers/Express';
import { Logger } from './config/Logger';
import { EnvConfig } from './config/EnvConfig';
import { connectMongodb } from './config/Db';
import stoppable, { WithStop } from 'stoppable';

export class Server {
    private static instance: Server;
    private logger: Logger;
    private env: EnvConfig;
    private stoppableServer: WithStop | null = null;

    private constructor() {
        this.logger = new Logger();
        this.env = new EnvConfig();
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public async startServer(): Promise<void> {
        try {
            if (this.env.envInit().ENABLE_CLUSTERING && cluster.isPrimary) {
                this.startClustering();
            } else {
                await this.startApplication();
            }

            this.handleProcessEvents();
        } catch (error) {
            this.logger.error(`Failed to start server:${error}`);
            process.exit(1);
        }
    }

    private startClustering(): void {
        const numCPUs = this.env.envInit().NODE_ENV === "dev" ? 1 : os.cpus().length;
        this.logger.info(`🚀 Master cluster setting up ${numCPUs} workers`);



        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('online', (worker) => {
            this.logger.info(`Worker ${worker.process.pid} is online`);
        });

        cluster.on('exit', (worker, code, signal) => {
            this.logger.error(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
            this.logger.info('Starting a new worker');
            cluster.fork();
        });
    }

    private async startApplication(): Promise<void> {
        const express = new Express();
        const app = new App(express.app);
        await app.initServer();

        const httpServer = app.getServer();
        this.stoppableServer = stoppable(httpServer, 10000)
    }

    private handleProcessEvents(): void {
        process.on('unhandledRejection', (reason: Error | any) => {
            this.logger.error(`Unhandled Rejection at Promise':${reason}`);

            this.initiateGracefulShutdown();
        });

        process.on('uncaughtException', (error: Error) => {
            this.logger.error(`Uncaught Exception thrown':${error}`);

            this.initiateGracefulShutdown();
        });

        process.on('SIGTERM', () => this.initiateGracefulShutdown());
        process.on('SIGINT', () => this.initiateGracefulShutdown());
    }

    private async initiateGracefulShutdown(): Promise<void> {
        this.logger.info('🔄 Graceful shutdown initiated');

        try {

            if (this.stoppableServer) {
                this.stoppableServer.stop(() => {
                    this.logger.info('👋 Gracefully shut down the server');
                    process.exit(0); // Exit after server stops
                });
            }
            else {
                this.logger.info('👋 Gracefully shutting down the application');
                process.exit(0);

            }

            // Close any other resources (Redis, message queues, etc.)
            // await redis.quit();
            // await messageQueue.close();

        } catch (error) {
            this.logger.error(`Error during graceful shutdown:${error}`);

            process.exit(1);
        }
    }
}