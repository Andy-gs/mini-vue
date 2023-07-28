import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly', () => {
    test('should not make non-reactive properties reactive', () => {
        const prop: any = shallowReadonly({n: { foo: 1}})
        expect(isReadonly(prop)).toBe(true)
        expect(isReadonly(prop.n)).toBe(false)
    })
})