import { GetRoleAgregateDTO } from "../../application/dto/role.dto";
import { GetUserAggregateDTO, GetUserDTO } from "../../application/dto/user.dto";
import { UserAggregate } from "../../domain/aggregate";
import { User } from "../../domain/entities";

export class UserPresenter {
    static toJson(user: User): GetUserDTO {
        return {
            id: user.getId,
            uuid: user.getUuid.value,
            username: user.getUsername,
            email: user.getEmail,
        }
    }
    static agregateToJson(user: UserAggregate): GetUserAggregateDTO {
        const roles: GetRoleAgregateDTO[] = user.getRoles.map(role => {
            const r = role.getRoles
            return {
                id: r.getId,
                name: r.getName,
                description: r.getDescription,
                permissions: role.getPermissions.map(p => {
                    return {
                        id: p.getId,
                        name: p.getName,
                        description: p.getDescription
                    }
                })
            }
        })
        const u = user.getUser
        return {
            id: u.getId,
            uuid: u.getUuid.value,
            username: u.getUsername,
            email: u.getEmail,
            roles
        }
    }
  
}