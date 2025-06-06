import { inject, injectable } from "inversify";
import { UserAggregate } from "../../domain/aggregate";
import { failureHandler, Result, result as r, failure as f } from "../../utils";
import { UserRepository } from "../../domain/repositories";
import { validate as uuidValidate } from 'uuid'

@injectable()
export class GetUserByUuid {
    constructor(
        @inject('UserRepository') private userRepository: UserRepository,
    ){}
    async execute(uuid: string): Promise<Result<UserAggregate>>{
        try {
            if (!uuidValidate(uuid)) {
                return r.failure(f.badRequest('Invalid UUID format'))
            }
            return await this.userRepository.getByUUID(uuid)
        } catch (error) {
            return failureHandler(error, 'GetUserByUuidUsecase')
        }
    }
}