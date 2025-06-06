import { ZodError } from "zod";
import { AppError, databaseErrorHandler } from "../errors";
import { isFailure, result as r } from "./result";
import { ValidationError, NotFoundError, DBError, UniqueViolationError, NotNullViolationError, ForeignKeyViolationError } from 'objection';


export type FailureCode =
  | 'TOKEN_EXPIRED'
  | 'DUPLICATE_ENTRY'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED'
  | 'FOREIGN_KEY_VIOLATION'
  | 'INTERNAL_SERVER_ERROR';

export type AppFailure = {
  code: FailureCode;
  message: string;
  statusCode: number;
};

export type FailureFactory = (message?: string) => AppFailure;

export const failure = {
    tokenError(message = 'Token has expired'): AppFailure {
      return { code: 'TOKEN_EXPIRED', message, statusCode: 401 };
    },
  
    duplicate(message = 'Duplicate entry'): AppFailure {
      return { code: 'DUPLICATE_ENTRY', message, statusCode: 409 };
    },
  
    badRequest(message = 'Bad request'): AppFailure {
      return { code: 'BAD_REQUEST', message, statusCode: 400 };
    },
  
    notFound(message = 'Not found'): AppFailure {
      return { code: 'NOT_FOUND', message, statusCode: 404 };
    },
  
    forbidden(message = 'Access forbidden'): AppFailure {
      return { code: 'FORBIDDEN', message, statusCode: 403 };
    },
  
    unauthorized(message = 'Unauthorized'): AppFailure {
      return { code: 'UNAUTHORIZED', message, statusCode: 401 };
    },

    invalidCredentials(message = 'Invalid username or password'): AppFailure {
        return { code: 'UNAUTHORIZED', message, statusCode: 401 };
    },

    foreignKeyViolation(message = 'Foreign key violation'): AppFailure {
        return { code: 'FOREIGN_KEY_VIOLATION', message, statusCode: 400 };
    },
  
    internal(message = 'Internal server error'): AppFailure {
      return { code: 'INTERNAL_SERVER_ERROR', message, statusCode: 500 };
    }
};

function formatZodError(error: ZodError): string {
    return error.errors
      .map((e) => `${e.path.join('.') || 'root'}: ${e.message}`)
      .join(', ');
  }

export const failureHandler = (error: any, className: string = '') => {
    if (isFailure(error)){
        return error
    } else if (error instanceof ZodError) {
        return r.failure(failure.badRequest(formatZodError(error)))
    } else if(error instanceof ValidationError){
        return r.failure(failure.badRequest(`${error.type} Error: ${error.message}`))
    }else if(error instanceof NotFoundError){
        return r.failure(failure.notFound())
    }else if (error instanceof UniqueViolationError) {
        return r.failure(failure.duplicate(`${error.columns} on ${error.table} already exists`))
    } else if (error instanceof NotNullViolationError) {
        return r.failure(failure.badRequest(`${error.column} on ${error.table} must not empty`))
    } else if (error instanceof ForeignKeyViolationError) {
        return r.failure(failure.foreignKeyViolation(`Foreign key constraint violation ${error.constraint} on the table ${error.table}`))
    } else{
        const message = error.message ? error.message : 'Unknown Error';
        throw new AppError(`${className}Error: ${message}`);
    } 
}