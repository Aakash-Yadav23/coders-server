import { Application, Express } from "express";
import { EnvConfig } from "../config/EnvConfig";
import { Logger } from "../config/Logger";

export class App {

    private _app: Application;
    private logger;

    constructor(app: Application) {
        this._app = app;
        this.logger = new Logger();
    }



    public initServer = async () => {
        const port = new EnvConfig().envInit().port;

        this._app.listen(port, () => {
            this.logger.info(`🔥🔥🔥🔥 server is listening on http://localhost:${port}`)
        });

    }



}