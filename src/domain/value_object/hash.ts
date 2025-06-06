import { SALT_ROUND } from "../../config/path.config";
import bcrypt from "bcryptjs";

export class Hash {
    private constructor(private data: string){}

    static async create(password: string): Promise<Hash>{
        const salt = await bcrypt.genSalt(SALT_ROUND)
        const hash = await bcrypt.hash(password, salt)
        return new Hash(hash)
    }

    get value(): string {
        return this.data
    }
}