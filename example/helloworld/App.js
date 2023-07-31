import { h } from "../../lib/xin-mini-vue.esm.js"

export const App = {
    // 没搞编译，所以template不写，写render就行
    // 这里假设用户强制写render
    render() {
        // 返回虚拟VNode
        return h('div', `h1,${this.msg}`)
    },

    setup() {
        // composition api
        return {
            msg: 'mini-vue'
        }
    }

}