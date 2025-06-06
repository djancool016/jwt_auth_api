import { Model } from "objection";

export class PermissionModel extends Model {
    id!: number;
    name!: string;
    description!: string;

    static tableName = 'permission';

    static get idColumn(){
        return 'id'
    }
}