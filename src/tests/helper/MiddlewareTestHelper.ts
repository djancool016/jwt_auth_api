import { NextFunction, Request, Response } from 'express';
import { createMockRequest, createMockResponse } from './test-utils';

type MiddlewareTestCase<Req extends Request = Request> = {
    label: string;
    middleware: (req: Req, res: Response, next: NextFunction) => any;
    req?: Partial<Req>;
    res?: Partial<Response>;
    expected: {
        status?: number;
        json?: any;
        nextCalled?: boolean;
        nextError?: any;
        customCheck?: (req: Req, res: Response, next: jest.Mock) => void;
    };
    setup?: () => void;
};

export function MiddlewareTestHelper<Req extends Request = Request>(
    describeText: string,
    cases: MiddlewareTestCase<Req>[]
) {
    describe(describeText, () => {
        cases.forEach(({ label, middleware, req = {}, res = {}, expected, setup }) => {
            it(label, async () => {
                if (setup) setup();

                const mockReq = createMockRequest<Req>(req);
                const mockRes = createMockResponse(res);
                const next = jest.fn();

                await middleware(mockReq, mockRes, next);

                if (expected.status !== undefined) {
                    expect(mockRes.status).toHaveBeenCalledWith(expected.status);
                }

                if (expected.json !== undefined) {
                    expect(mockRes.json).toHaveBeenCalledWith(expected.json);
                }

                if (expected.nextCalled) {
                    expect(next).toHaveBeenCalled();
                }

                if (expected.nextError !== undefined) {
                    if(expected.nextError instanceof Error){
                        expect(next).toHaveBeenCalledWith(expect.any(Error));
                    }else {
                        expect(next).toHaveBeenCalledWith(expected.nextError);
                    }
                }

                if (expected.customCheck) {
                    expected.customCheck(mockReq, mockRes, next);
                }
            });
        });
    });
}
