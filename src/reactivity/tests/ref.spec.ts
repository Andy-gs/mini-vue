import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, proxyRefs, ref, unRef } from "../ref"

describe('ref', () => {
    it('happy path', () => {
        const a: any = ref(1)
        expect(a.value).toBe(1)

    })

    it('should make nested properties reactive', () => {
        const a: any = ref(1)
        let dummy
        let calls = 0
        effect(() => {
            calls++
            dummy = a.value
        })

        expect(calls).toBe(1)
        expect(dummy).toBe(1)

        a.value = 2

        expect(calls).toBe(2)
        expect(dummy).toBe(2)

        // same value should not trigger
        a.value = 2

        expect(calls).toBe(2)
        expect(dummy).toBe(2)
    })

    it('should make nested properties reactive', () => {
        const a: any = ref({
            count: 1
        })
        let dummy
        effect(() => {
            dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
    })

    it('isRef', () => {
        const a = 1
        const b = ref(a)
        const user = reactive({
            age: 1
        })
        expect(isRef(a)).toBe(false)
        expect(isRef(b)).toBe(true)
        expect(isRef(user)).toBe(false)

    })

    it('unRef', () => {
        const a = 1
        const b = ref(a)
        expect(unRef(a)).toBe(1)
        expect(unRef(b)).toBe(1)

    })
    

})