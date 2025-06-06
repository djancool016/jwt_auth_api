import { injectable } from "inversify";
import { UserAggregate } from "../../domain/aggregate";
import { User } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";
import { Result, failureHandler, result as r, failure as f } from "../../utils";
import { UserMapper } from "../mapper/user.mapper";
import { UserModel } from "../models/user.model";
import { transaction } from "objection";
import { RoleModel } from "../models/role.model";

@injectable()
export class UserRepositoryImpl implements UserRepository {

    async save(data: { uuid: string; username: string; email: string; password: string; }): Promise<Result<User>> {
        const trx = await transaction.start(UserModel.knex())
        try {           
            // create the user
            const user = await UserModel.query(trx).insertAndFetch(data)
            // get role data
            const defaultRole = await RoleModel.query(trx).findOne({name: 'user'});
            if(!defaultRole) return r.failure(f.foreignKeyViolation('Role not found'))
            // attach role to user
            await user.$relatedQuery('roles', trx).relate(defaultRole.id);
            await trx.commit()

            return UserMapper.toEntity(user)
        } catch (error) {
            await trx.rollback();
            return failureHandler(error, 'UserRepositoryImplSave')
        }
    }

    async getByUsername(username: string): Promise <Result<UserAggregate>> {
        try {
            const result = await UserModel.query()
                .where('username', username)
                .withGraphFetched('roles.permissions')
                .first()
                .throwIfNotFound()
                
            return UserMapper.toAgregate(result)
        } catch (error) {
            return failureHandler(error, 'UserRepositoryImplGetByUsername')
        }
    }
    async getByUUID(uuid: string): Promise<Result<UserAggregate>> {
        try {
            const result = await UserModel.query()
                .where('uuid', uuid)
                .withGraphFetched('roles.permissions')
                .first()
                .throwIfNotFound()
                
            return UserMapper.toAgregate(result)
        } catch (error) {
            return failureHandler(error, 'UserRepositoryImplGetByUuid')
        }
    }
    edit(id: number, data: Partial<{ username?: string; email?: string; password?: string; }>): Promise<Result<User>> {
        throw new Error("Method not implemented.");
    }
}