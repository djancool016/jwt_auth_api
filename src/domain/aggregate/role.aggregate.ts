import { Permission, Role } from "../entities";

export class RoleAggregate {
    constructor(
        private role: Role,
        private permissions: Permission[]
    ){}
    get getRoles(): Role{
        return this.role;
    }

    get getPermissions(): Permission[] {
        return this.permissions;
    }

    get toStringPermissions(): string[]{
        return this.permissions.map(permission => permission.getName)
    }
}