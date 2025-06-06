import { Knex } from "knex";

export const roleSeed = [
    { id: 1, name: 'admin', description: 'Administrator with full access' },
    { id: 2, name: 'user', description: 'Regular user with limited access' },
    { id: 3, name: 'teller', description: 'Teller responsible for transactions' },
    { id: 4, name: 'manager', description: 'Manager overseeing team operations' },
    { id: 5, name: 'auditor', description: 'Auditor for reviewing transactions' }
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("role").del();

    // Inserts seed entries
    await knex("role").insert(roleSeed);
};
