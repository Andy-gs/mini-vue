import { h, renderSlots } from "../../lib/xin-mini-vue.esm.js"
export const Foo = {
    render() {
        const foo = h('p', {}, 'foo')
        const age = 18
        const name = 'xin'
        console.log(this.$slots);
        return h('div', {}, [renderSlots(this.$slots, 'header', {age}), foo, renderSlots(this.$slots, 'footer', {name})])
    },
    setup() {
        return {}
    }
}