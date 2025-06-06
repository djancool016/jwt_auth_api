import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid'

export const userSeed = [
    {
        id: 1,
        uuid: uuidv4(),
        username: 'admin',
        password: '$2b$10$h6Uo0u07tzgVf14jTsIPHOskqDUdDwLsZeMFCxX5rm8BsEJTePZd.',
        email: 'admin@example.com'
    },
    {
        id: 2,
        uuid: uuidv4(),
        username: 'testUser',
        password: '$2b$10$h6Uo0u07tzgVf14jTsIPHOskqDUdDwLsZeMFCxX5rm8BsEJTePZd.',
        email: 'testUser@example.com'
    }
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user").del();

    // Inserts seed entries
    await knex("user").insert(userSeed);
};
