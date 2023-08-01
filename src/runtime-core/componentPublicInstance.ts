
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
}


export const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState } = instance
        if (key in setupState) {
            return Reflect.get(setupState, key)
        }
        const publicGetter = Reflect.get(publicPropertiesMap, key)
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}