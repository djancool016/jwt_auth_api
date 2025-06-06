import { AppError } from "../errors";
import { AppFailure, failure, FailureFactory } from "./failures";

export type Result < T > = Success < T > | Failure;

export interface Success < T > {
    readonly type: 'success';
    readonly data: T;
}

export interface Failure {
    readonly type: 'failure';
    readonly error: AppFailure;
}

export function isSuccess < T > (result: Result < T > ): result is Success < T > {
    return result.type === 'success';
}

export function isFailure < T > (result: Result < T > ): result is Failure {
    return result.type === 'failure';
}

/**
 * Immediately catches and handles errors during Result object unwrapping, preventing unintended behavior.
 */
export function unwrapOrThrow<T>(result: Result<T>): T {
    if (isFailure(result)) {
      throw result; 
    }
    return result.data;
  }

export const result = {
    success < T > (data: T): Result < T > {
        return { type: 'success', data };
    },
    failure(error: AppFailure): Failure {
        return { type: 'failure', error };
    }
};

export async function wrapResult < T > (
    fn: () => T,
    failWith: AppFailure
): Promise<Result<T>> {
    try {
        const value = fn();
        return result.success(value);
    } catch (error: any) {
        if (isFailure(error)) return result.failure(failWith);
        throw new AppError(error.message ?? `Error: ${error}`)
    }
}

export async function wrapResultAsync < T > (
    fn: () => Promise<T>,
    failWith: AppFailure
): Promise<Result<T>> {
    try {
        const value = await fn();
        return result.success(value);
    } catch (error: any) {
        if (isFailure(error)) return result.failure(failWith);
        throw new AppError(error.message ?? `Error: ${error}`)
    }
}


export function map < T, R > (
    result: Result < T > ,
    transform: (data: T) => R
): Result < R > {
    if (isSuccess(result)) {
        return { type: 'success', data: transform(result.data) };
    } else {
        return result;
    }
}

export function flatMapSync < T, R > (
    result: Result < T > ,
    transform: (data: T) => Result < R >
): Result < R > {
    return isSuccess(result) ? transform(result.data) : result;
}


export async function flatMapAsync < T, R > (
    result: Result < T > ,
    transform: (data: T) => Result < R > | Promise < Result < R >>
): Promise < Result < R >> {
    if (!isSuccess(result)) return result;
    const transformed = transform(result.data);
    return transformed instanceof Promise ? await transformed : transformed;
}

export async function chainFlatMapAsync < T > (
    initial: Result < T > ,
    ...transforms: Array < (data: any) => Result < any > | Promise < Result < any >>>
): Promise < Result < any >> {
    let currentResult: Result < any > = initial;

    for (const transform of transforms) {
        if (!isSuccess(currentResult)) break;
        const transformed = transform(currentResult.data);
        currentResult = transformed instanceof Promise ? await transformed : transformed;
    }

    return currentResult;
}

export function chainFlatMapSync < T > (
    initial: Result < T > ,
    ...transforms: Array < (data: any) => Result < any >>
): Result < any > {
    let currentResult: Result < any > = initial;

    for (const transform of transforms) {
        if (!isSuccess(currentResult)) break;
        const transformed = transform(currentResult.data);
        currentResult = transformed;
    }

    return currentResult;
}

export function fold < T, R > (
    result: Result < T > ,
    handlers: {
        onSuccess: (data: T) => R;
        onFailure: (error: AppFailure) => R;
    }
): R {
    return isSuccess(result) ?
        handlers.onSuccess(result.data) :
        handlers.onFailure(result.error);
}