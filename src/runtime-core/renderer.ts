import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"


export function render(vnode, container) {

    // patch()
    patch(vnode, container)

}

function patch(vnode: any, container: any) {
    const { type, props, children, shapeFlag } = vnode
    // 判断vnode是不是一个element
    if (shapeFlag & ShapeFlags.ELEMENT) {
        // 处理element
        processElement(vnode, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
    const { type, props, children, shapeFlag } = vnode
    const el = (vnode.el = document.createElement(type))

    // children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el)
    }

    // props
    for (const key in props) {
        const value = props[key]
        const isOn = (key) => /^on[A-Z]/.test(key)
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase()
            el.addEventListener(event, value)
        } else {
            el.setAttribute(key, value)
        }
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



