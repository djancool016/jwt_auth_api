import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('permission');
    
    if(!exists){
        return knex.schema.createTable('permission', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.string('description').nullable();
        });
    }
    }


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('permission');
}

