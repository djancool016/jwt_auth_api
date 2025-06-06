import { knex } from 'knex';
import knexConfig from '../../config/knex.config'

const db = knex(knexConfig);

export const dbConnect = async () => {
    try {
        await db.raw('SELECT 1');
    } catch (error) {
        const err = error as Error;
        throw new Error(`Failed connect to database: ${err.message}`);
    }
};

export default db;