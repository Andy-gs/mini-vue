import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        // 不需要赋值了，直接把slots的引用给到它
        normalizeObjectSlots(children, instance.slots)
    }
}

function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key]
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props))
    }
}

function normalizeSlotValue(value) {
    // 和之前要做一样的处理，判断是不是数组
    return Array.isArray(value) ? value : [value]
}