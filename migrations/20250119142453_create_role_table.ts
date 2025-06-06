import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('role');

    if(!exists){
        return knex.schema.createTable('role', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.string('description').nullable();
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('role');
}

