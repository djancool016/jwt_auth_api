import { Model } from "objection";
import { RoleModel } from "./role.model";
import { PermissionModel } from "./permission.model";

export class RolePermissionModel extends Model{
    id!: number;
    role_id!: number;
    permission_id!: number;

    static tableName = 'role_permission';

    static get idColumn(){
        return 'id'
    }

    static relationMappings = {
        role: {
            relation: Model.BelongsToOneRelation,
            modelClass: RoleModel,
            join: {
                from: 'role_permission.role_id',
                to: 'role.id'
            }
        },
        permission: {
            relation: Model.BelongsToOneRelation,
            modelClass: PermissionModel,
            join: {
                from: 'role_permission.permission_id',
                to: 'permission.id'
            }
        }
    }
}