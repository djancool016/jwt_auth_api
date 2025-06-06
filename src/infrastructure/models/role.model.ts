import { Model } from "objection";
import { PermissionModel } from "./permission.model";

export class RoleModel extends Model {
    id!: number;
    name!: string;
    description!: string;
    permissions!: PermissionModel[]

    static tableName = 'role';

    static get idColumn(){
        return 'id';
    }

    static relationMappings = {
        permissions: {
            relation: Model.ManyToManyRelation,
            modelClass: PermissionModel,
            join: {
                from: 'role.id',
                through: {
                    from: 'role_permission.role_id',
                    to: 'role_permission.permission_id'
                },
                to: 'permission.id'
            }
        }
    }
}