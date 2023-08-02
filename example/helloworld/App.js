import { h } from "../../lib/xin-mini-vue.esm.js"
import { Foo } from './Foo.js'

export const App = {
    // 没搞编译，所以template不写，写render就行
    render() {
        // 返回虚拟VNode
        return h('div',
            {
                id: 'root',
                class: ['bgc-red', 'font-blue'],
            },
            [h('div', {}, 'hi,' + this.msg), h(Foo, {
                count: 99
            })]
            // `hi,${this.msg}`
            // this.$el -> get root element
            // string
            // 'h1,mini-vue'
            // array
            // [h('p', { class: 'font-green' }, 'hi'), h('p', {class: 'font-pink'}, 'mini-vue')]
        ) 
    },
    setup() {
        // composition api
        return {
            msg: 'mini-vue'
        }
    }
}