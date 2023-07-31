import { createVNode } from "./vnode"
import { render } from "./renderer"

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 转换VNod
            // component -> VNode
            // 后续所有逻辑都是基于VNode上处理

            const vnode = createVNode(rootComponent)

            // 调用render函数
            render(vnode, rootContainer)
        }
    }
}