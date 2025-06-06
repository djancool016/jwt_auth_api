import { Knex } from "knex";
import container from "../../../infrastructure/di/container";
import { LoginUsecase, TokenResponse } from "../../../application/usecases/login.usecase";
import { UnitTestHelper } from "../../helper/UnitTestHelper";
import { isFailure, Result } from "../../../utils";
import { mockUser } from "../../helper/MockData";
import { RegisterUsecase } from "../../../application/usecases/register.usecase";

describe('Test Login Usecase', () => {
    const loginUsecase = container.get<LoginUsecase>('LoginUsecase')
    const register = container.get<RegisterUsecase>('RegisterUsecase')
    const db = container.get<Knex>('Knex')

    beforeAll(async() => {
        await db.migrate.latest();
        await db.seed.run();
    })

    afterAll(async() => {
        await db.destroy()
    })

    UnitTestHelper('Login', [
        {
            label: 'Success should return result tokens',
            setup: () => mockUser(),
            method: async (mockUser) => {
                await register.execute(mockUser)
                return loginUsecase.execute(mockUser.username, mockUser.password)
            },
            expected: (result: Result<TokenResponse>) => {
                if(isFailure(result)) throw result
                expect(result.data.accessToken).toBeTruthy()
                expect(result.data.refreshToken).toBeTruthy()
            }
        },{
            label: 'Invalid username should return result UnauthorizeFailure',
            setup: () => mockUser(),
            method: async (mockUser) => {
                await register.execute(mockUser)
                return loginUsecase.execute('unknown_user', mockUser.password)
            },
            expected: (result: Result<TokenResponse>) => {
                if(isFailure(result)){
                    expect(result.error.code).toEqual('UNAUTHORIZED')
                    expect(result.error.message).toMatch(/invalid username/i)
                    return
                }
                throw result
            }
        },{
            label: 'Invalid password should return result UnauthorizeFailure',
            setup: () => mockUser(),
            method: async (mockUser) => {
                await register.execute(mockUser)
                return loginUsecase.execute(mockUser.username, 'invali password')
            },
            expected: (result: Result<TokenResponse>) => {
                if(isFailure(result)){
                    expect(result.error.code).toEqual('UNAUTHORIZED')
                    expect(result.error.message).toMatch(/invalid password/i)
                    return
                }
                throw result
            }
        }
    ])
})