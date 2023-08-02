import { h } from "../../lib/xin-mini-vue.esm.js"
import { Foo } from './Foo.js'

export const App = {
    name: 'App',
    render() {
        // emit
        return h('div', {}, [h('div', {}, 'App'), h(Foo, {
            // onAdd(a, b) {
            //     console.log('onAdd', a, b);
            // },
            onAddFooFoo(a,b) {
                console.log('onAddFoo', a, b)
            }
        })])
    },
    setup() {

        return {}
    }
}