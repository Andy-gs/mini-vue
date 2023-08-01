import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"


export function render(vnode, container) {

    // patch()
    patch(vnode, container)

}

function patch(vnode: any, container: any) {
    // 判断vnode是不是一个element
    if (typeof vnode.type === 'string') {
        // 处理element
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}

function mountElement(vnode: any, container: any) {
    const { type, props, children } = vnode
    const el = (vnode.el = document.createElement(type))

    // string array<TODO>
    if (typeof children === 'string') {
        el.textContent = children
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el)
    }


    for (const key in props) {
        const value = props[key]
        el.setAttribute(key, value)
    }

    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container)
    })
}

function mountComponent(initialVNode: any, container: any) {
    const instance = createComponentInstance(initialVNode)

    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
}



function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    const { proxy } = instance
    // subTree是一个VNode tree
    const subTree = instance.render.call(proxy)

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container)

    // element -> mount
    initialVNode.el = subTree.el
}



