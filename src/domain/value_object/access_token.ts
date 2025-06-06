import { TokenPayload } from "../types/token_payload";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXP } from "../../config/path.config";


export class AccessToken {
    private constructor(private data: string){}

    static create(payload: TokenPayload): AccessToken{
        const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXP})
        return new AccessToken(token)
    }

    get value(): string {
        return this.data
    }
}