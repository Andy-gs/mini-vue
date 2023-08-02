export const extend = Object.assign

export const isObject = (value: any) => value !== null && typeof value === 'object'

// 不展开说 Object.is，Object.is 理解为更为严格的三等号 === 比较就行
export const hasChanged = (oldValue: any, newValue: any) => Object.is(oldValue, newValue)

export const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)