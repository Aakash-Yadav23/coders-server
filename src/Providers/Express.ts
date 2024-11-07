import express, { Application, Router } from "express";
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { EnvConfig } from "../config/EnvConfig";
import { Logger } from "../config/Logger";
import { IRequest, IResponse } from "../interfaces/Express";
import helmet from 'helmet';
import rateLimitter   from "rate-limiter-flexible";
import { RateLimiterMemory } from "rate-limiter-flexible";


interface IRoutes {
    path: string;
    route: Router;
}

export class Express {
    public app: Application = express();
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
        this.applyMiddleware();
        this.initRoutes();
    }

    private applyMiddleware = () => {
        this.app.use(cors({
            origin: [new EnvConfig().envInit().CORS_SITES],
        }));



        this.app.use(helmet());


        this.app.use(compression({ level: 9 }));

        this.app.use(morgan('combined', { stream: this.logger.getMorganStream() }));
    };

    private initRoutes = () => {
        this.app.use("/", (req: IRequest, res: IResponse) => {
            res.json("OK!")
        })
    };
}
