import { extend } from "../shared"

// 全局变量收集effect fn
let activeEffect
let shouldTrack
class ReactiveEffect {
    private _fn: any
    public deps = []
    cleanupEffectActive = true
    onStop?: () => void
    public scheduler: Function | undefined
    constructor(fn, scheduler?: Function) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        if (!this.cleanupEffectActive) {
            return this._fn()
        }
        shouldTrack = true
        // 全局变量收集effect fn
        activeEffect = this
        const res = this._fn()
        shouldTrack = false
        return res
    }
    stop() {
        if (this.cleanupEffectActive) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.cleanupEffectActive = false
        }
    }
}

function cleanupEffect(effect) {
    effect.deps.forEach(dep => {
        dep.delete(effect)
    });
    effect.deps.length = 0
}

const targetMap = new Map() 
export function track(target, key) {
    if (!activeEffect) return
    if (!shouldTrack) return

    // target -> key -> dep
    let depsMap = targetMap.get(target)
    // 初始化判断
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)

}

export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

export function stop(runner) {
    runner.effect.stop()
}

export function effect(fn, options: any = {}) {
    // fn 

    const _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}