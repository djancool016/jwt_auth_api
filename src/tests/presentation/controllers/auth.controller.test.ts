import { Knex } from "knex";
import container from "../../../infrastructure/di/container";
import { IntegrationTestHelper } from "../../helper/IntegrationTestHelper";
import request from 'supertest';
import app from "../../../app";
import { mockUser } from "../../helper/MockData";
import { GetUserDTO, InsertUserDTO } from "../../../application/dto/user.dto";

describe('AuthController test', () => {
    const db = container.get<Knex>('Knex')
    const registerPath = '/api/user/register'

    beforeAll(async() => {
        await db.migrate.latest();
        await db.seed.run();
    })

    afterAll(async() => {
        await db.destroy()
    })
    IntegrationTestHelper<InsertUserDTO, GetUserDTO>(`POST ${registerPath}`, [
        {
            label: 'Should success 201 and returning user data',
            setup: () => mockUser(),
            method: (mockUser) => request(app).post(registerPath).send(mockUser),
            expected: {
                status: 201,
                body: (result, mockUser) => {
                    expect(result).toMatchObject({ 
                        uuid: mockUser.uuid, 
                        username: mockUser.username,
                        email: mockUser.email 
                    });
                }
            }
        },{
            label: 'Should fail 400 if user already exists',
            setup: () => mockUser({username: 'admin'}),
            method: (mockUser) => request(app).post(registerPath).send(mockUser),
            expected: {
                status: 409,
                body: (result: any, mockUser) => {
                    expect(result.message).toMatch(/already exists/i)
                }
            }
        }
    ])
})