import { Role } from "../../domain/entities";
import { Result, result as r, failureHandler} from "../../utils";

type RoleFactoryProps = {
    id: number;
    name: string,
    description: string
}

export class RoleFactory {
    static create(data: RoleFactoryProps): Result<Role>{
        try {
            const role = new Role(
                data.id,
                data.name,
                data.description
            )
            return r.success(role)
        } catch (error: any) {
            return failureHandler(error, 'RoleFactory')
        }
    }
}