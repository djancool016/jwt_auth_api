import { ZodSchema } from "zod";
import { Result, result as r, failure, FailureFactory } from "../../utils";

export abstract class ValueObject < T > {
    protected constructor(protected readonly data: T) {}

    protected static validate < T > (
        schema: ZodSchema < T > ,
        value: T,
        failWith: FailureFactory = failure.badRequest
    ): Result < T > {
        const parsed = schema.safeParse(value);
        if (!parsed.success) {
            const message = parsed.error.errors.map(e => e.message).join(', ')
            return r.failure(failWith(message));
        }
        return r.success(parsed.data);
    }
    get value(): T {
        return this.data
    }
}