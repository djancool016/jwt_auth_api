import { Permission } from "../../domain/entities";
import { Result, failureHandler, result as r } from "../../utils";

type PermissionFactoryProps = {
    id: number;
    name: string,
    description: string
}

export class PermissionFactory {
    static create(data: PermissionFactoryProps): Result<Permission>{
        try {
            const role = new Permission(
                data.id,
                data.name,
                data.description
            )
            return r.success(role)
        } catch (error: any) {
            return failureHandler(error, 'PermissionFactory')
        }
    }
}