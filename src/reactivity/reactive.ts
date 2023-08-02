import { isObject } from '../shared/index'
import { mutableHandlers, readonlyBaseHandlers, shallowReadonlyBaseHandlers } from './baseHandlers'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw: any) {
    return createActiveObject(raw)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyBaseHandlers)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyBaseHandlers)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE] // 不是 Proxy 就不会调用 get，得到的就是 undefined，所以双重取反布尔值就行
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY] // 不是 Proxy 就不会调用 get，得到的就是 undefined，所以双重取反布尔值就行
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}

// 如果抽离了 readonly 的 set，这里默认值设不设置都可以，我这里抽离了的，所以默认值放上是可以的
export function createActiveObject(raw, beseHandlers = mutableHandlers) {
    if (!isObject(raw)) console.warn('target必须是一个对象')
    return new Proxy(raw, beseHandlers)
}