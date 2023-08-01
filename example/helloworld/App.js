import { h } from "../../lib/xin-mini-vue.esm.js"

export const App = {
    // 没搞编译，所以template不写，写render就行
    // 这里假设用户写了render
    render() {
        // 返回虚拟VNode
        return h('div',
            {
                id: 'root',
                class: ['bgc-red', 'font-blue']
            },
            // `hi${this.msg}`
            // string
            // 'h1,mini-vue'
            // array
            [h('p', { class: 'font-green' }, 'hi'), h('p', {class: 'font-pink'}, 'mini-vue')]
        ) // 没实现this问题
    },
    setup() {
        // composition api
        return {
            msg: 'mini-vue'
        }
    }
}