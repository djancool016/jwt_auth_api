import { Request, Response, NextFunction } from "express";
import { Result, result as r, failure as f, unwrapOrThrow as ut } from "../../utils";
import { AuthenticateToken } from "../../application/usecases/authenticateToken";
import { TokenPayload } from "../../domain/types/token_payload";

export const authMiddleware = (allowedRoles: string[], allowedPermissions: string []) => {
    return (req: Request & {payload: TokenPayload}, res: Response, next: NextFunction) => {
        try {
            const token = ut(getToken(req))
            const payload = ut(AuthenticateToken.execute(token));
            ut(verifyUserRolesPermissions(allowedRoles, allowedPermissions, payload))
            req.payload = payload
            next()
        } catch (error) {
            next(error)
        }
    }
}

export function getToken(req: Request): Result<string> {
    const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return r.failure(f.unauthorized('Invalid header format'))
        }
        const token = authorizationHeader.split(' ')[1];
        if(!token) return r.failure(f.unauthorized('No token found'))
        return r.success(token)
}

export function verifyUserRolesPermissions(
    allowedRoles: string[], 
    allowedPermissions: string [], 
    payload: TokenPayload
): Result<boolean> {
    // Check if roles exist and match
    const hasRole = allowedRoles?.length > 0 && 
        payload.roles.some(role => allowedRoles.includes(role));

    // Check if permissions exist and match
    const hasPermission = allowedPermissions?.length > 0 && 
        payload.permissions.some(permission => allowedPermissions.includes(permission));

    // Access is granted if either roles or permissions match
    if (hasRole || hasPermission) return r.success(true);
    return r.failure(f.forbidden())
}