export interface TokenPayload{
    uuid: string,
    roles: string[],
    permissions: string[],
    iat?: number,
    exp?: number
}