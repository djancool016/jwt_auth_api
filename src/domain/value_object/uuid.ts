import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { Result, result as r, failure as f} from '../../utils'

export class Uuid {
    private constructor(private data: string) {}

    static create(): Uuid {
        const uuid = uuidv4()
        return new Uuid(uuid)
    }

    static fromString(uuid: string): Result<Uuid> {
        if (!uuidValidate(uuid)) {
            return r.failure(f.badRequest('Invalid UUID format'))
        }
        return r.success(new Uuid(uuid))
    }

    get value(): string {
        return this.data
    }
}