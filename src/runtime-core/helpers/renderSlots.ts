import { createVNode } from "../vnode";

export function renderSlots(slots, name, props) {
    const slot = slots[name]
    if (slot) {
        // 现在的slot是一个function了
        if(typeof slot === 'function') {
            return createVNode('div', {}, slot(props))
        }
    }
}