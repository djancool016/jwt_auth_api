import { Knex } from "knex";
import container from "../../../infrastructure/di/container";
import { UnitTestHelper } from "../../helper/UnitTestHelper";
import { isFailure, Result } from "../../../utils";
import { RegisterUsecase } from "../../../application/usecases/register.usecase";
import { mockUser } from "../../helper/MockData";
import { User } from "../../../domain/entities";
import { InsertUserDTO } from "../../../application/dto/user.dto";

describe('Test Login Usecase', () => {
    const registerUsecase = container.get<RegisterUsecase>('RegisterUsecase')
    const db = container.get<Knex>('Knex')

    beforeAll(async() => {
        await db.migrate.latest();
        await db.seed.run();
    })

    afterAll(async() => {
        await db.destroy()
    })
    
    UnitTestHelper<InsertUserDTO, Result<User>>('Login', [
        {
            label: 'Success should return result tokens',
            setup: () => mockUser(),
            method: (user) => registerUsecase.execute(user),
            expected: (result: Result<User>, user) => {
                if (isFailure(result)) throw result;
                expect(result.data.getUsername).toEqual(user.username);
                expect(result.data.getUuid.value).toEqual(user.uuid);
            }
        }
    ])
})