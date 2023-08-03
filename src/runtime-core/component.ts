import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: (event) => { }
    }
    component.emit = emit.bind(null, component)
    return component
}

export function setupComponent(instance) {
    const { vnode: { props, children } } = instance

    // TODO
    initProps(instance, props)
    initSlots(instance, children)

    setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {
    const Component = instance.type

    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)

    const { setup } = Component
    if (setup) {
        // setup可以返回一个function，也可以返回一个object
        // 返回function我们认为是它是组件的一个render函数
        // 返回object认为是一个会把object注入到当前的组件的上下文中

        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })

        handleSetupResult(instance, setupResult)
    }
}
function handleSetupResult(instance, setupResult: any) {
    // return function
    // return object
    // 基于上面两种情况判断

    // TODO
    // function

    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }

    // 需要保证render是有值的状态

    finishComponentSetup(instance)



}

function finishComponentSetup(instance: any) {
    // 看看当前的组件有没有对应的render

    const Component = instance.type

    // 先假设一定有render，要不然跑不起来
    instance.render = Component.render
}

