import { RoleFactory } from "../../application/factory/role.factory";
import { RoleAggregate } from "../../domain/aggregate";
import { Role } from "../../domain/entities";
import { Result, unwrapOrThrow as ut, result as r, isFailure, AppError, failureHandler } from "../../utils";
import { RoleModel } from "../models/role.model";
import { PermissionMapper } from "./permission.mapper";

export class RoleMapper {
    static toEntity(model: RoleModel): Result<Role>{
        try {
            return RoleFactory.create({
                id: model.id,
                name: model.name,
                description: model.description
            })
        } catch (error: any) {
            return failureHandler(error, 'RoleMapperToEntity')
        }
    }
    static toAgregate(model: RoleModel): Result<RoleAggregate>{
        try {
            const permissions = model.permissions.map(permission => {
                return ut(PermissionMapper.toEntity(permission))
            })
            const roleAgregate = new RoleAggregate(ut(RoleMapper.toEntity(model)), permissions)
            return r.success(roleAgregate)
        } catch (error: any) {
            return failureHandler(error, 'RoleMapperToAgregate')
        }
    }
}