export const isArray: typeof Array.isArray = Array.isArray;
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === "[object Map]";
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === "[object Set]";

export const isDate = (val: unknown): val is Date => toTypeString(val) === "[object Date]";
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === "[object RegExp]";
export const isFunction = (val: unknown): val is (...args: any[]) => any => typeof val === "function";
export const isString = (val: unknown): val is string => typeof val === "string";
export const isSymbol = (val: unknown): val is symbol => typeof val === "symbol";
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === "object";

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
	return (isObject(val) || isFunction(val)) && isFunction((val as any).then) && isFunction((val as any).catch);
};

export const objectToString: typeof Object.prototype.toString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === "[object Object]";

/**
 * Only concerns number-like strings
 * "123-foo" will be returned as-is
 */
export const toNumber = (val: any): any => {
	const n = isString(val) ? Number(val) : Number.NaN;
	return Number.isNaN(n) ? val : n;
};
