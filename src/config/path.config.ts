import path from 'path';
import { config } from 'dotenv';
import { AppError } from '../utils';

function validateEnvVariable() {
    const env = process.env.NODE_ENV || 'development';
    const rootDir = process.cwd();
    const envFile = path.resolve(rootDir, `.env.${env}`);
    config({ path: envFile });

    const requiredVars = ['DB_DATABASE', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_PORT'];
    const isSqlite = process.env.DB_SYSTEM === 'sqlite3';
    const missingVars = requiredVars.filter(varName => !process.env[varName] && !isSqlite);

    if (missingVars.length > 0) {
        throw new AppError(`Environment variables are not set: ${missingVars.join(', ')}`);
    }

    return {
        envFile,
        env,
        DB_DATABASE: process.env.DB_DATABASE as string,
        DB_HOST: process.env.DB_HOST as string,
        DB_USER: process.env.DB_USER as string,
        DB_PASSWORD: process.env.DB_PASSWORD as string,
        DB_PORT: process.env.DB_PORT as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXP: Number(process.env.ACCESS_TOKEN_EXP),
        REFRESH_TOKEN_EXP: Number(process.env.REFRESH_TOKEN_EXP),
        SALT_ROUND: Number(process.env.SALT_ROUND),
        DB_SYSTEM: process.env.DB_SYSTEM as 'pg' | 'sqlite3',
        migrationsDir: path.resolve(rootDir, 'migrations'),
        seedsDir: path.resolve(rootDir, 'seeds'),
        sqliteDir: path.resolve(rootDir, 'test_db.sqlite3')
    };
}

export const {
    envFile,
    env,
    DB_DATABASE,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_SYSTEM,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXP,
    REFRESH_TOKEN_EXP,
    SALT_ROUND,
    migrationsDir,
    seedsDir,
    sqliteDir
} = validateEnvVariable();