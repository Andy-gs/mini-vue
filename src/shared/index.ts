export const extend = Object.assign

export function assign<T extends {}, U>(target: T, source: U): asserts target is T & U {
    Object.assign(target, source);
}

export const isObject = (value: any) => value !== null && typeof value === 'object'

// 不展开说 Object.is，Object.is 理解为更为严格的三等号 === 比较就行
export const hasChanged = (oldValue: any, newValue: any) => Object.is(oldValue, newValue)

export const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

export const camelize = (str: string) => str.replace(/-(\w)/g, (_, c: string) => c ? c.toUpperCase() : '')

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const toHandlerKey = (str: string) => str ? `on${capitalize(str)}` : ''