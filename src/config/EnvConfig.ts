interface IEnvTyps {
    port: number;
    defaultPath: string;
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
            { name: 'DEFAULT_PATH', value: process.env.DEFAULT_PATH }
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
        const port = parseInt(process.env.PORT!, 10);
        const defaultPath = process.env.DEFAULT_PATH || '';

        // Return the object that matches IEnvTyps
        const env: IEnvTyps = {
            port,
            defaultPath
        };

        return env;
    };
}
