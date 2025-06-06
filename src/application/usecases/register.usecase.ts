import { inject, injectable } from "inversify";
import { User } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";
import { failureHandler, Result, unwrapOrThrow as ut} from "../../utils";;
import { InsertUserDTO, insertUserSchema } from "../dto/user.dto";
import { Uuid } from "../../domain/value_object/uuid";
import { Hash } from "../../domain/value_object/hash";

@injectable()
export class RegisterUsecase {
    constructor(
        @inject('UserRepository') private userRepository: UserRepository,
    ){}
    async execute(user: InsertUserDTO): Promise<Result<User>>{
        try {
            const validate = insertUserSchema.safeParse(user)
            if(!validate.success) throw validate.error

            const data = validate.data
            data.password = (await Hash.create(data.password)).value
            if(!data.uuid) data.uuid = (Uuid.create()).value
            return this.userRepository.save(data)

        } catch (error) {
            return failureHandler(error, 'Register')
        }
    }
}