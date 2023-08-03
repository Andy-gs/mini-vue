import { ShapeFlags } from "../shared/ShapeFlags"
import { isObject } from "../shared/index"

export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null
    }
    // children
    if (typeof children === 'string') {
        // 等同于 vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    if((vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) && isObject(children)) {
        vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }

    return vnode
}

export function getShapeFlag(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT
}