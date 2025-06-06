import { REFRESH_TOKEN_SECRET } from "../../config/path.config";
import { TokenPayload } from "../../domain/types/token_payload";
import { AccessToken } from "../../domain/value_object/access_token";
import { failureHandler, Result, result as r, failure as f } from "../../utils";
import jwt, { JwtPayload } from 'jsonwebtoken';

export class RotateToken {
    static execute(refreshToken: string): Result<string>{
        try {
            const result = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload
            const payload: TokenPayload = {
                uuid: result.uuid,
                roles: result.roles,
                permissions: result.permissions
            } 
            if (!payload.uuid || !payload.roles || !payload.permissions) {
                return r.failure(f.unauthorized('Payload data is missing'));
            }
            const newAccessToken = AccessToken.create(payload)
            return r.success(newAccessToken.value)
        } catch (error) {
            return failureHandler(error, 'Register')
        }
    }
}