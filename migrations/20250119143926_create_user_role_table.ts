import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('user_role');
    
    if(!exists){
        return knex.schema.createTable('user_role', (table) => {
            table.increments('id').primary();
            table.integer('role_id').unsigned().notNullable().references('id').inTable('role').onDelete('CASCADE');
            table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE');
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('user_role');
}

