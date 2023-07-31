import { createComponentInstance, setupComponent } from "./component"


export function render(vnode, container) {

    // patch()
    patch(vnode, container)

}

function patch(vnode: any, container: any) {
    // TODO
    // 判断vnode是不是一个element

    // 处理element
    // processElement()

    // 处理组件
    processComponent(vnode, container)

}
function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
    const instance = createComponentInstance(vnode)

    setupComponent(instance)

    setupRenderEffect(instance, container)
}



function setupRenderEffect(instance, container: any) {
    // subTree是一个VNode tree
    const subTree = instance.render()

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container)
}

