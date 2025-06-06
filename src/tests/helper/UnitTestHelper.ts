export type UnitTestCase < T = void, R = any > = {
    label ? : string;
    setup ? : () => T | Promise < T > ;
    method: (setupResult: T) => R | Promise < R > ;
    expected: Error | ((result: R, setupResult: T) => void) | R;
};

/**
 * A single unit test case definition.
 *
 * @template T - The type of data returned from `setup()` and passed to `method()` and `expected()`.
 * @template R - The type of result returned from `method()` and passed to `expected()`.
 */
export function UnitTestHelper < T = void, R = any > (
    describeText: string,
    cases: UnitTestCase < T, R > []
): void {
    describe(describeText, () => {
        cases.forEach(({ label, setup, method, expected }) => {
            it(label ?? 'should behave as expected', async () => {
                try {
                    const setupResult = (setup ? await setup() : undefined) as Awaited < T > ;
                    const resultPromise = method(setupResult);

                    if (expected instanceof Error) {
                        await expect(resultPromise).rejects.toThrow(expected);
                    } else {
                        const result = await resultPromise;

                        if (typeof expected === 'function') {
                            (expected as(res: Awaited < R > , setup: Awaited < T > ) => void)(result, setupResult);
                        } else {
                            expect(result).toEqual(expected);
                        }
                    }
                } catch (err) {
                    //console.error(`❌ Error in test case "${label}":`, err);
                    throw err;
                }
            });
        });
    });
}
  

function isPromise<T>(obj: any): obj is Promise<T> {
    return !!obj && typeof obj.then === 'function';
}

function toPromise(fn: () => any): () => Promise<any> {
    return () => {
        try {
            const result = fn();
            return isPromise(result) ? result : Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    };
}

