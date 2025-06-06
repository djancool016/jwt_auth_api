import { UserFactory } from "../../application/factory/user.factory";
import { UserAggregate } from "../../domain/aggregate";
import { User } from "../../domain/entities";
import { Result, unwrapOrThrow as ut, result as r, failureHandler } from "../../utils";
import { UserModel } from "../models/user.model";
import { RoleMapper } from "./role.mapper";

export class UserMapper {
    static toEntity(model: UserModel): Result < User > {
        try {
            return UserFactory.create({
                id: model.id,
                uuid: model.uuid,
                username: model.username,
                email: model.email,
                password: model.password
            })
        } catch (error: any) {
            return failureHandler(error, 'UserMapperToEntity')
        }
    }
    static toAgregate(model: UserModel): Result <UserAggregate>{
        try {
            // create user entity
            const user = ut(UserMapper.toEntity(model))
            // create roles agregate
            const rolesAgregate = model.roles.map(role => ut(RoleMapper.toAgregate(role)))
            return r.success(new UserAggregate(user, rolesAgregate))
        } catch (error: any) {
            return failureHandler(error, 'UserMapperToAgregate')
        }
    }
}