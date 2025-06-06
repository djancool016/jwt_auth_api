import { Result } from "../../utils";
import { Role } from "../entities";

type RoleSaveData = {
    name?: string,
    description?: string
}

type RoleEditData = {
    name?: string,
    description?: string
}

export interface RoleRepository {
    save(role: RoleSaveData): Promise<Result<Role>>;
    getAll(): Promise<Result<Role[]>>;
    getById(id: number): Promise<Result<Role>>;
    edit(id: number, data: Partial<RoleEditData>): Promise<Result<Role>>;
}