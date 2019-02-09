export const DESIGN_TYPE = 'design:type';
export const DESIGN_RETURNTYPE = 'design:returntype';
export const DESIGN_PARAMTYPES = 'design:paramtypes';

export type Type<T> = new (...args: any[]) => T;
export type AnyType =  new (...args: any[]) => any;

export type ObjectValue<T> = T[keyof T];

export type MaybeArray<T> = T[] | T;
