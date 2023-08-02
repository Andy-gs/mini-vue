import { h } from "../../lib/xin-mini-vue.esm.js"
export const Foo = {
    render() {
        return h('div', {}, 'foo:' + this.count)
    },
    setup(props) {
        // props 不可更改
        // 使render的h函数内能使用this.count
        // shallowReadonly 类型的响应式对象
        console.log(props)
        props.count++ 
        console.log(props)
    }
}