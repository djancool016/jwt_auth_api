import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const exists = await knex.schema.hasTable('role_permission');
    
    if(!exists){
        return knex.schema.createTable('role_permission', (table) => {
            table.increments('id').primary();
            table.integer('role_id').unsigned().notNullable().references('id').inTable('role').onDelete('CASCADE');
            table.integer('permission_id').unsigned().notNullable().references('id').inTable('permission').onDelete('CASCADE');
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('role_permission');
}

