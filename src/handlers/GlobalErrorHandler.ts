import { Logger } from "../config/Logger";
import { INextFunction, IRequest, IResponse } from "../interfaces/Express";
import { ApiResponse } from "../interfaces/response.types";
import { AppError } from "./Error";


export class ErrorHandler {

    public static handleTrustedError = (err: AppError, res: IResponse) => {

        const response: ApiResponse<null> = {
            status: err.status as "fail" | "error" | "success",
            statusCode: err.statusCode,
            message: err.message,
            metadata: {
                timestamp: new Date().toISOString(),
                path: res.req.path,
                version: '1.0'
            }


        }
        res.status(err.statusCode).json(response);
        return
    }


    public static handleCriticalError = (err: Error, res: IResponse) => {
        new Logger().error(`Critical Error- ${err}`);
        
        const response: ApiResponse<null> = {
            status: "fail",
            statusCode: 500,
            message: err.message,
            error: {
                type: err.name,
                details:  process.env.isDevelopment ? err.stack : undefined
            },
            metadata: {
                timestamp: new Date().toISOString(),
                path: res.req.path,
                version: '1.0'
            }


        }
        res.status(500).json(response);
        return
    }

    public static handleError = (err: Error | AppError, req: IRequest, res: IResponse, next: INextFunction) => {

        if (err instanceof AppError) {
            return ErrorHandler.handleTrustedError(err, res);
        }

        return ErrorHandler.handleCriticalError(err, res);
    }

}