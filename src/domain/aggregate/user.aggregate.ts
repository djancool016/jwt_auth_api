import { User } from "../entities";
import { RoleAggregate } from "./role.aggregate";

export class UserAggregate {
    constructor(
        private user: User,
        private roles: RoleAggregate[],
    ){}

    get getUser(): User {
        return this.user;
    }

    get getRoles(): RoleAggregate[] {
        return this.roles;
    }

    get toStringRoles(): string[]{
        return this.roles.map(role => role.getRoles.getName);
    }

    get toStringPermissions(): string []{
        return this.roles.flatMap(role => role.toStringPermissions)
    }
}