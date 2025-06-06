import { Knex } from 'knex';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, env, migrationsDir, seedsDir, sqliteDir } from './path.config';

const knexConfig: { [key: string] : Knex.Config} = {
    development: {
        client: 'pg',
        connection: {
          host: DB_HOST,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_DATABASE,
          port: parseInt(DB_PORT || '5432', 10),
        },
        pool: { min: 2, max: 10 },
        migrations: { 
            directory: migrationsDir,
        },
        seeds: {
            directory: seedsDir
        },
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: sqliteDir
        },
        useNullAsDefault: true,
        pool: { min: 1, max: 1 },
        migrations: { 
            directory: migrationsDir,
        },
        seeds: {
            directory: seedsDir
        },
    },
};

export default knexConfig[env];