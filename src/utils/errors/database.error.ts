import { DB_SYSTEM } from "../../config/path.config";
import { failure as f, result as r, Result } from "../wrapper";
import { AppError } from "./app.error";

type SupportedClient = 'pg' | 'sqlite3';

/**
 * Unified DB error handler
 */
export function databaseErrorHandler(
    error: unknown,
    client: SupportedClient = DB_SYSTEM 
): Promise<Result<never>> {
    if (client === 'pg') {
        return handlePostgreError(error);
    } else if (client === 'sqlite3') {
        return handleSqliteError(error);
    }

    throw new AppError('Unknown database client');
}

/**
 * PostgreSQL-specific error handling
 */
function handlePostgreError(error: any): Promise<Result<never>> {
  const code = error?.code;

  switch (code) {
    case '23505': // Unique violation
      return Promise.resolve(r.failure(f.duplicate(error.message)));

    case '23502': // Not null violation
    case '23503': // Foreign key violation
    case '23514': // Check constraint
    case '22P02': // Invalid text representation (e.g., UUID parsing)
      return Promise.resolve(r.failure(f.badRequest(error.message)));

    default:
      return Promise.resolve(r.failure(f.internal(`${code || 'Unknown Error Code'}: ${error.message}`)));
  }
}

/**
 * SQLite-specific error handling
 */
function handleSqliteError(error: any): Promise<Result<never>> {
  const code = error.nativeError.code;
  const message = error.nativeError.message || 'Unknown SQLite error';

  switch (code) {
    case 'SQLITE_CONSTRAINT':
      if (message.includes('PRIMARY KEY') || message.includes('UNIQUE')) {
        return Promise.resolve(r.failure(f.duplicate(message)));
      }
      return Promise.resolve(r.failure(f.badRequest(message)));

    case 'SQLITE_MISMATCH':
      return Promise.resolve(r.failure(f.badRequest(message)));

    default:
      return Promise.resolve(r.failure(f.internal(`${code || 'Unknown Error Code'}: ${message}`)));
  }
}