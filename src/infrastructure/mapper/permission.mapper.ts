import { PermissionFactory } from "../../application/factory/permission.factory";
import { Permission } from "../../domain/entities";
import { failureHandler, Result } from "../../utils";
import { PermissionModel } from "../models/permission.model";

export class PermissionMapper{
    static toEntity(model: PermissionModel): Result<Permission> {
        try {
            return PermissionFactory.create({
                id: model.id,
                name: model.name,
                description: model.description
            }) 
        } catch (error) {
            return failureHandler(error, 'PermissionMapperToEntity')
        }
    }
}