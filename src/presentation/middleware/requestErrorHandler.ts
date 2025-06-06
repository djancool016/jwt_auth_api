import { NextFunction, Request, Response } from "express";
import { AppError, isFailure } from "../../utils";

export const requestErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(isFailure(err)){
        return res.status(err.error.statusCode).json({
            code: err.error.code,
            message: err.error.message
        })
    } else if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    } 
    console.error(err); // Log unexpected errors for debugging
    res.status(500).json({ message: "Internal Server Error" });
};