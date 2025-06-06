export * from './errors';
export * from './wrapper';

export function isTruthly(data: any): boolean {
    if (Array.isArray(data)) {
      return data.length > 0;
    }
    if (typeof data === 'number') {
      return data > 0;
    }
    if (data && typeof data === 'object') {
      return Object.keys(data).length > 0;
    }
    return !!data;
}