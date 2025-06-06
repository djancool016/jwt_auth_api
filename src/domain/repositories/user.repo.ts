import { Result } from "../../utils";
import { UserAggregate } from "../aggregate/user.aggregate";
import { User } from "../entities/user.entity";

type UserEditData = {
    username?: string,
    email?: string,
    password?: string
}

type UserSaveData = {
    uuid: string,
    username: string,
    email: string,
    password: string
}

export interface UserRepository{
    save(user: UserSaveData): Promise<Result<User>>;
    getByUsername(username: string): Promise<Result<UserAggregate>>;
    getByUUID(uuid: string): Promise<Result<UserAggregate>>;
    edit(id: number, data: Partial<UserEditData>): Promise<Result<User>>;
}