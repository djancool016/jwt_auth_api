import { Knex } from "knex";
import container from "../../../infrastructure/di/container";
import { isFailure, Result, unwrapOrThrow as ut } from "../../../utils";
import { UnitTestHelper } from "../../helper/UnitTestHelper";
import { mockUser } from "../../helper/MockData";
import { LoginUsecase, TokenResponse } from "../../../application/usecases/login.usecase";
import { RegisterUsecase } from "../../../application/usecases/register.usecase";
import { UserAggregate } from "../../../domain/aggregate";
import { GetUserByUuid } from "../../../application/usecases/getUserByUuid";
import { RotateToken } from "../../../application/usecases/rotateToken";

describe('Test Login Usecase', () => {
    const loginUsecase = container.get<LoginUsecase>('LoginUsecase')
    const registerUsecase = container.get<RegisterUsecase>('RegisterUsecase')
    const getUserByUuid = container.get<GetUserByUuid>('GetUserByUuid')
    const db = container.get<Knex>('Knex')
    let mock = mockUser()
    let user: UserAggregate

    beforeAll(async() => {
        await db.migrate.latest();
        await db.seed.run();
        // register new user
        ut(await registerUsecase.execute(mock))
        // get new user data
        user = ut(await getUserByUuid.execute(mock.uuid)) 
    })

    afterAll(async() => {
        await db.destroy()
    })
    
    UnitTestHelper<TokenResponse, Result<string>>('Login', [
        {
            label: 'Success should return result tokens',
            setup: async () => ut(await loginUsecase.execute(user.getUser.getUsername, mock.password)),
            method: (tokens) => RotateToken.execute(tokens.refreshToken),
            expected: (result, tokenResponse) => {
                if (isFailure(result)) throw result;
                expect(tokenResponse.refreshToken).toBeTruthy
                expect(result).toBeTruthy
            }
        }
    ])
})