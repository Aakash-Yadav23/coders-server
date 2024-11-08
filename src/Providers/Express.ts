import express, { Application, Router, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ErrorHandler } from '../handlers/GlobalErrorHandler';
import { Logger } from '../config/Logger';
import { EnvConfig } from '../config/EnvConfig';
import { IRequest, IResponse } from '../interfaces/Express';

export class Express {
    public app: Application;
    private logger: Logger;
    private env: EnvConfig;
    private rateLimiter: RateLimiterMemory;

    constructor() {
        this.app = express();
        this.logger = new Logger();
        this.env = new EnvConfig();
        this.rateLimiter = new RateLimiterMemory({
            points: 10, // Number of requests
            duration: 1, // Per second
        });
        this.initializeRateLimiter();
        this.applyPreRoutesMiddleware();
        this.initializeRoutes();
        this.applyPostRoutesMiddleware();
    }

    private initializeRateLimiter(): void {
        this.rateLimiter = new RateLimiterMemory({
            points: 10, // Number of requests
            duration: 1, // Per second
        });
    }

    private applyPreRoutesMiddleware(): void {
        
        this.app.use(helmet({
            contentSecurityPolicy: this.env.envInit().NODE_ENV === 'production',
        }));

        // CORS
        this.app.use(cors({
            origin: this.env.envInit().CORS_SITES.split(','),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        }));

        // Request parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Compression
        this.app.use(compression({
            level: 6,
            threshold: 100 * 1000, // 100kb
        }));

        // Rate limiting
        this.app.use(this.rateLimiterMiddleware.bind(this));

        // Logging
        if (this.env.envInit().NODE_ENV !== 'test') {
            this.app.use(morgan('combined', { stream: this.logger.getMorganStream() }));
        }

        // Trust proxy
        this.app.set('trust proxy', 1);
    }

    private async rateLimiterMiddleware(req: IRequest, res: IResponse, next: NextFunction): Promise<void> {
        try {
            await this.rateLimiter.consume(req.ip!);
            next();
        } catch (error) {
            res.status(429).json({
                status: 'error',
                message: 'Too many requests, please try again later.',
            });
        }
    }

    private initializeRoutes(): void {
        // Health check route
        this.app.get('/health', (req: IRequest, res: IResponse) => {
            res.status(200).json({
                status: 'success',
                message: 'Server is healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
            });
        });

        // Add your routes here
        // this.app.use('/api/v1/users', userRoutes);
    }

    private applyPostRoutesMiddleware(): void {
        // 404 handler
        this.app.use((req: IRequest, res: IResponse) => {
            res.status(404).json({
                status: 'error',
                message: `Cannot ${req.method} ${req.url}`,
            });
        });

        // Error handling
        this.app.use(ErrorHandler.handleError);
    }


    
}
