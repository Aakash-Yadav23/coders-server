import { Pool } from 'pg';
import mongoose, { ConnectOptions } from 'mongoose';
import { EnvConfig } from './EnvConfig';
import fs from 'fs';
import path from 'path';
import { Logger } from './Logger';

const env = new EnvConfig().envInit();

// PostgreSQL Pool Configuration
const pool = new Pool({
    host: env.PG_HOST,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    database: env.PG_DB,
    port: env.PG_PORT,
    idleTimeoutMillis: env.PG_TIMEOUT || 30000,
    max: 20,
    ssl: env.NODE_ENV === "dev" ? {
        rejectUnauthorized: false,
        

    } : {
        ca: fs.readFileSync(path.join(__dirname, "../../certificates/pg.crt")).toString(),
        rejectUnauthorized: true,
    },
});

const connectMongodb = async () => {
    try {
        new Logger().info("Connecting  to mongodb...")
        await mongoose.connect(env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000
        } as ConnectOptions);
        new Logger().info("Connected  to mongodb...")

    } catch (error: any) {
        console.error("MongoDB connection error:", error);
        new Logger().error(`Mongodb connection Error- ${error}`)

        process.exit(1);
    }
};

export { pool, connectMongodb };
