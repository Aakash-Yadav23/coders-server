import express, { Application } from "express";

interface IRoutes{
    path:string;
    route:express.Router;

}

export class Express {
    public app: Application = express();
    constructor() {
    }

    private initRoutes = ({path,route}:IRoutes) => {

        this.app.use(`/${path}`,route)

    }
}