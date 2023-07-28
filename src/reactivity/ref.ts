import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
    private _value: any
    public dep
    private _rawValue: any
    constructor(value: any) {
        this._rawValue = value
        // value 为对象时转为reactive包一层
        this._value = convert(value)

        this.dep = new Set()
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newValue) {
        if (hasChanged(this._rawValue, newValue)) return
        this._rawValue = newValue
        this._value = convert(newValue)
        triggerEffects(this.dep)
    }
}

export function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

export function convert(value) {
    return isObject(value) ? reactive(value) : value
}


export function ref(value) {
    return new RefImpl(value)
}