import { readonly, isReadonly, isProxy } from "../reactive"

describe('readonly', () => {
    it('should make nested values readonly', () => {

        // readonly 不可以被set<改写>

        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = readonly(original)

        expect(wrapped).not.toBe(original)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(original)).toBe(false)
        expect(isReadonly(wrapped.bar)).toBe(true)
        expect(isReadonly(original.bar)).toBe(false)
        expect(wrapped.foo).toBe(1)
        expect(isProxy(wrapped)).toBe(true)
        expect(isProxy(original)).toBe(false)
    })

    it('warn then call readonly set', () => {
        // console.warn()
        // mock
        console.warn = jest.fn()
        const user = readonly({
            age: 11
        })

        user.age = 22
        // 验证有没有被调用
        expect(console.warn).toBeCalled()
    })
})