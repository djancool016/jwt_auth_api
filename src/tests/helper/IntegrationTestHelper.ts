import { Response } from 'supertest';

export type IntegrationTestCase<T = void, R = any> = {
    label: string;
    method: (setupResult: T) => Promise<Response>;
    expected: {
        status: number;
        body?: Error | R | ((result: R, setupResult: T) => void);
        headers?: Record<string, string>;
    };
    setup?: () => T | Promise<T>;
};

export function IntegrationTestHelper<T = void, R = any>(
    describeText: string,
    cases: IntegrationTestCase<T, R>[],
) {
    describe(describeText, () => {
        cases.forEach(({ label, method, expected, setup }) => {
            it(label, async () => {
                const setupResult = (setup ? await setup() : undefined) as Awaited<T>;
                let response: Response;
                try {
                    response = await method(setupResult);
                } catch (error) {
                    expect(error).toBeTruthy();
                    if (error instanceof Error) console.error(error.message);
                    return;
                }

                if (expected.body !== undefined) {
                    if (typeof expected.body === 'function') {
                        (expected.body as (body: R, setup: T) => void)(response.body, setupResult);
                    } else if (expected.body instanceof Error) {
                        expect(response.body).toMatchObject({
                            name: expected.body.name,
                            message: expected.body.message,
                        });
                    } else {
                        expect(response.body).toEqual(expected.body);
                    }
                }

                if (expected.headers) {
                    for (const [key, value] of Object.entries(expected.headers)) {
                        expect(response.headers[key.toLowerCase()]).toBe(value);
                    }
                }

                expect(response.status).toBe(expected.status);
                return
            });
        });
    });
}
