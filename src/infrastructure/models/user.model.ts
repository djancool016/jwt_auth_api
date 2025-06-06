import { Model } from "objection";
import { RoleModel } from "./role.model";

export class UserModel extends Model{
    id!: number;
    uuid!: string;
    username!: string;
    email!: string;
    password!: string;
    login_attempt!: number;
    created_at!: string;
    updated_at!: string;
    deleted_at!: string;
    logout_at!: string;
    roles!: RoleModel[];

    static tableName = 'user';

    static get idColumn(){
        return 'id'
    }

    static relationMappings = {
        roles: {
            relation: Model.ManyToManyRelation,
            modelClass: RoleModel,
            join: {
                from: 'user.id',
                through: {
                    from: 'user_role.user_id',
                    to: 'user_role.role_id'
                },
                to: 'role.id'
            }
        }
    }
}