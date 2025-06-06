import { UserFactory } from "../../../application/factory/user.factory";
import { UserAggregate } from "../../../domain/aggregate";
import { User } from "../../../domain/entities";
import { UserRepository } from "../../../domain/repositories";
import db from "../../../infrastructure/database/knex";
import container from "../../../infrastructure/di/container";
import { isFailure, result as r, Result, unwrapOrThrow as ut, failure as f, AppFailure } from "../../../utils";
import { mockUser } from "../../helper/MockData";
import { UnitTestHelper } from "../../helper/UnitTestHelper";

describe('UserRepositoryImpl', () => {
    let userRepo: UserRepository;
    
    beforeAll(async() => {
        await db.migrate.latest();
        await db.seed.run();
        userRepo = container.get('UserRepository');
    })

    afterAll(async() => {
        await db.destroy()
    })

    UnitTestHelper(
        'GetByUsername',[
            {
                label: 'should return user when username exists',
                method: async () => await userRepo.getByUsername('admin'),
                expected: (result: Result<UserAggregate>) => {
                    if(isFailure(result)) throw result 
                    expect(result.data.getUser.getUsername).toBe('admin')             
                }
            }
        ]
    )
    UnitTestHelper(
        'Save',[
            {
                label: 'succes insert new usershould return user',
                method: async () => await userRepo.save(mockUser()),
                expected: (result: Result<User>) => {
                    if(isFailure(result)) throw result 
                    expect(result.data.getUsername).toMatch(/test_user/i);           
                }
            },{
                label: 'duplicate username should return failure',
                method: async () => await userRepo.save(mockUser({username: 'admin'})),
                expected: (result: Result<User>) => {
                    if(isFailure(result)){
                        expect(result.error.code).toEqual('DUPLICATE_ENTRY')
                        expect(result.error.message).toMatch(/already exist/i)
                        return
                    }
                    throw result
                }
            }
        ]
    )
});
