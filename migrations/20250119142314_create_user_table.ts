import type { Knex } from "knex";
import knexConfig from "../src/config/knex.config"
const dbClient = knexConfig.client;

export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('user');

    if(!exists){
        await knex.schema.createTable('user', (table) => {
            table.increments('id').primary();
            table.string('username').notNullable().unique().checkLength(">=", 5);
            table.string('email').notNullable().unique().checkLength(">=", 5);
            table.string('password').notNullable().checkLength(">=", 5);
            table.integer('login_attempt').notNullable().defaultTo(0);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.timestamp('deleted_at').nullable();
            table.timestamp('logout_at').nullable();
            table.uuid('uuid').notNullable().notNullable().unique();
        })

        if(dbClient == 'pg'){
            // Create the trigger function for updated_at
            await knex.raw(`
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = now();  -- Set updated_at to the current timestamp
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `);
    
             // Create the trigger
            await knex.raw(`
                CREATE TRIGGER update_user_updated_at
                BEFORE UPDATE ON "user"
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `);
        }
    }
}


export async function down(knex: Knex): Promise<void> {
    if(dbClient == 'pg'){
        await knex.raw('DROP TRIGGER IF EXISTS update_user_updated_at ON "user"');
        await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column');
    }
    await knex.schema.dropTableIfExists('user');
}
