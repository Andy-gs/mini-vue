import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"

// 不需要每次都创建一个新的get，set，初始化时创建一个即可
const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)



// 抽离get
function createGetter(isReadonly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)

        // 判断是不是 reactive
        if(key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if(key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        
        // 依赖收集
        // 抽离公共，判断是否需要收集依赖<readonly>
        !isReadonly && track(target, key)
        return res
    }
}

// 抽离set
// readonly 的 set 和 reactive 的 set 是有功能的本质区别
// 所以可以不抽离，或者单独抽离一个 readonly 的 set <readonlySet>，我这里是抽离了的
function createSetter(isReadonly = false) {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        if (!isReadonly) {
            // 触发依赖
            trigger(target, key)
            return res
        } else {
            console.warn(`key${key}set失败，${target}是只读`)
            return true
        }
    }
}

// 不需要每次都创建一个新的get，set，初始化时创建一个即可
export const mutableHandlers = {
    get,
    set
}

export const readonlyBaseHandlers = {
    get: readonlyGet,
    set: readonlySet
}