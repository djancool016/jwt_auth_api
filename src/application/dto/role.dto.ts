import { GetPermissionDTO } from "./permission.dto";

export interface GetRoleDTO {
    id: number,
    name: string,
    description: string
}

export interface GetRoleAgregateDTO extends GetRoleDTO{
    permissions: GetPermissionDTO[]
}