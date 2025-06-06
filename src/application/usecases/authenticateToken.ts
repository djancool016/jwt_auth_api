import { ACCESS_TOKEN_SECRET } from "../../config/path.config";
import { TokenPayload } from "../../domain/types/token_payload";
import { failureHandler, Result, result as r, failure as f } from "../../utils";
import jwt, { JwtPayload } from 'jsonwebtoken';

export class AuthenticateToken {
    static execute(accessToken: string): Result<TokenPayload>{
        try {
            const result = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload
            const payload: TokenPayload = {
                uuid: result.uuid,
                roles: result.roles,
                permissions: result.permissions,
                iat: result.iat,
                exp: result.exp
            } 
            if (!payload.uuid || !payload.roles || !payload.permissions || !payload.iat || !payload.exp) {
                return r.failure(f.unauthorized('Payload data is missing'));
            }
            return r.success(payload)
        } catch (error) {
            return failureHandler(error, 'Register')
        }
    }
}