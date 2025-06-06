import { inject, injectable } from "inversify";
import { UserRepository } from "../../domain/repositories";
import { Result, failureHandler, isFailure, result as r, failure as f } from "../../utils";
import bcrypt from "bcryptjs";
import { AccessToken } from "../../domain/value_object/access_token";
import { TokenPayload } from "../../domain/types/token_payload";
import { RefreshToken } from "../../domain/value_object/refresh_token";

export type TokenResponse = {
    accessToken: string,
    refreshToken: string
}

@injectable()
export class LoginUsecase {
    constructor(
        @inject('UserRepository') private userRepository: UserRepository,
    ){}

    async execute(username: string, password: string): Promise<Result<TokenResponse>>{
        try {
            // get user
            const user = await this.userRepository.getByUsername(username)
            if(isFailure(user)) return r.failure(f.unauthorized('Invalid username'))
    
            // compare password
            const hash = user.data.getUser.getPassword
            const isValid = await bcrypt.compare(password, hash)
            if(!isValid) return r.failure(f.unauthorized('Invalid password'))

            const payload: TokenPayload = {
                uuid: user.data.getUser.getUuid.value,
                roles: user.data.toStringRoles,
                permissions: user.data.toStringPermissions
            }
            // generate tokens
            const tokens: TokenResponse = {
                accessToken: (AccessToken.create(payload)).value,
                refreshToken: (RefreshToken.create(payload)).value
            }
            return r.success(tokens)

        } catch (error: any) {
            return failureHandler(error, 'Login')
        }
    }
}