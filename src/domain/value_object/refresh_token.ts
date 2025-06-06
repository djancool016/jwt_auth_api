import { TokenPayload } from "../types/token_payload";
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXP } from "../../config/path.config";


export class RefreshToken {
    private constructor(private data: string){}

    static create(payload: TokenPayload): RefreshToken{
        const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXP})
        return new RefreshToken(token)
    }

    get value(): string {
        return this.data
    }
}