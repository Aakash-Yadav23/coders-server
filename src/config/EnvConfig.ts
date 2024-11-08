import dotenv from 'dotenv';

dotenv.config();

interface IEnvTyps {
    PORT: number;
    defaultPath: string;
    CORS_SITES: string
    PG_PASSWORD: string;
    PG_USER: string;
    PG_PORT: number;
    PG_HOST: string;
    PG_DB: string;
    PG_SERVICE_URI: string;
    MONGO_URI: string;
    PG_TIMEOUT?: number
    ENABLE_CLUSTERING: boolean;
    NODE_ENV:string
}

interface EnvType {
    name: string;
    value: any;

}

export class EnvConfig {
    private envVariables: EnvType[] = [];

    constructor() {
        this.envVariables = [
            { name: 'PORT', value: process.env.PORT },
            { name: 'DEFAULT_PATH', value: process.env.DEFAULT_PATH },
            { name: "PG_PASSWORD", value: process.env.CORS_SITES },
            { name: "PG_USER", value: process.env.PG_USER },
            { name: "PG_PORT", value: process.env.PG_PORT },
            { name: "PG_HOST", value: process.env.PG_HOST },
            { name: "PG_DB", value: process.env.PG_DB },
            { name: "PG_SERVICE_URI", value: process.env.PG_SERVICE_URI },
            { name: "MONGO_URI", value: process.env.MONGO_URI },
            { name: "PG_TIMEOUT", value: process.env.PG_TIMEOUT },
            { name: "ENABLE_CLUSTERING", value: process.env.ENABLE_CLUSTERING },



        ];
    }

    public envInit = (): IEnvTyps => {
        // Check if any required environment variables are missing
        this.envVariables.forEach((env) => {
            if (!env.value) {
                throw new Error(`Environment variable ${env.name} is missing`);
            }
        });

        // Parse the environment variables
        const PORT = parseInt(process.env.PORT!, 10);
        const defaultPath = process.env.DEFAULT_PATH || '';
        const CORS_SITES = process.env.CORS_SITES || '';
        const PG_USER = process.env.PG_USER!;
        const PG_PASSWORD = process.env.PG_PASSWORD!;

        const PG_PORT = parseInt(process.env.PG_PORT!, 10);
        const PG_HOST = process.env.PG_HOST!;
        const PG_DB = process.env.PG_DB!;
        const PG_SERVICE_URI = process.env.PG_SERVICE_URI!;
        const PG_TIMEOUT = parseInt(process.env.PG_TIMEOUT!, 10);
        const MONGO_URI = process.env.MONGO_URI!;
        const NODE_ENV = process.env.NODE_ENV!;

        const ENABLE_CLUSTERING = process.env.ENABLE_CLUSTERING === 'true';



        // Return the object that matches IEnvTyps
        const env: IEnvTyps = {
            PORT,
            defaultPath,
            CORS_SITES,
            PG_USER,
            PG_PORT,
            PG_HOST,
            PG_PASSWORD,
            PG_DB,
            PG_SERVICE_URI,
            PG_TIMEOUT,
            MONGO_URI,
            ENABLE_CLUSTERING,
            NODE_ENV
        };

        return env;
    };
}
