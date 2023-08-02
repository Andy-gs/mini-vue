import { hasOwn } from "../shared/index"

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
}


export const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState, props } = instance
        if (key in setupState) {
            return Reflect.get(setupState, key)
        }

        if (hasOwn(setupState, key)) {
            return Reflect.get(setupState, key)
        }
        else if (hasOwn(props, key)) {
            return Reflect.get(props, key)
        }

        const publicGetter = Reflect.get(publicPropertiesMap, key)
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}