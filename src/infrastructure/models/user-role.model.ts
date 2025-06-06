import { Model } from "objection";
import { RoleModel } from "./role.model";
import { UserModel } from "./user.model";

export class UserRoleModel extends Model {
    id!: number;
    role_id!: number;
    user_id!: number;

    static tableName = 'user_role';

    static get idColumn(){
        return 'id';
    }

    static relationMappings = {
        role: {
            relation: Model.BelongsToOneRelation,
            modelClass: RoleModel,
            join: {
                from: 'user_role.role_id',
                to: 'role.id'
            }
        },
        user_id: {
            relation: Model.BelongsToOneRelation,
            modelClass: UserModel,
            join: {
                from: 'user_role.role_id',
                to: 'user.id'
            }
        }
    }
}