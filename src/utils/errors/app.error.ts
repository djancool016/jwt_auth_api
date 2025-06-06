export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string = "Internal Server Error", statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}