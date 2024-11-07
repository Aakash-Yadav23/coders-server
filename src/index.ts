import dotenv from "dotenv";
import { Logger } from "./config/Logger";
import { App } from "./Providers/App";
import { Express } from "./Providers/Express";

dotenv.config();


const express = new Express();
const app = new App(express.app);


app.initServer()


