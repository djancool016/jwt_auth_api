import { Request, Response } from "express";

export function createMockRequest<T extends Request>(overrides: Partial<T> = {}): T {
    return {
        headers: {},
        body: {},
        params: {},
        query: {},
        ...overrides,
    } as T;
}
export function createMockResponse(overrides: Partial<Response> = {}): any {
    const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        ...overrides,
    };
    return res;
}

export function randomNumber(length: number, min?: number, max?: number): number {
    if (typeof min === 'number' && typeof max === 'number') {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    const lowerBound = 10 ** (length - 1);
    const upperBound = 10 ** length - 1;
    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
  }
  

export function randomString(length: number): string{
    return Array.from({length: length}, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

export function randomBoolean(): boolean{
    return Math.random() < 0.5;
}

export function randomDate(min: Date, max: Date): Date {
    const minTime = min.getTime();
    const maxTime = max.getTime();
    const randomTime = minTime + Math.random() * (maxTime - minTime);
    return new Date(randomTime);
}

