import { User } from "../../domain/entities";
import { Uuid } from "../../domain/value_object/uuid";
import { Result, unwrapOrThrow as ut, result as r, failureHandler } from "../../utils";

type UserFactoryProps = {
    id: number;
    uuid?: string;
    username: string;
    email: string;
    password: string;
};

export class UserFactory {
    static create(data: UserFactoryProps): Result<User> {
        try {
            const user = new User(
                data.id,
                data.uuid ? ut(Uuid.fromString(data.uuid)) : Uuid.create(),
                data.username,
                data.email,
                data.password
            );
            return r.success(user);

        } catch (error: any) {
            return failureHandler(error, 'UserFactory')
        }
    }
}