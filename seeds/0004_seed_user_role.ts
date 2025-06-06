import { Knex } from "knex";

export const userRoleSeed = [
    {
        id: 1,
        user_id: 1,
        role_id: 1
    },
    {
        id: 2,
        user_id: 2,
        role_id: 2
    }
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user_role").del();

    // Inserts seed entries
    await knex("user_role").insert(userRoleSeed);
};
