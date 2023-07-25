import { reactive } from '../reactive'
import { effect, stop } from '../effect'
describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            age: 10
        })

        let nextAge

        effect(() => {
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(11)


        // update
        user.age++
        expect(nextAge).toBe(12)
    })

    it('should return runner when call effect', () => {
        // effect(fn) -> function (runner) -> fn -> return

        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })

        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe('foo')

    })

    it('scheduler', () => {

        // 通过 effect 的第二个参数给定的一个 scheduler 的 fn
        // effect 第一次执行的时候依旧执行fn
        // 当响应式对象 set update 的时候不会执行 fn ，而是执行 scheduler
        // 如果当执行 runner 的时候，会再次执行 fn

        let dunmmy
        let run: any
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dunmmy = obj.foo
            },
            {
                scheduler
            }
        )

        expect(scheduler).not.toHaveBeenCalled()
        expect(dunmmy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dunmmy).toBe(1)
        run()
        expect(dunmmy).toBe(2)



    })

    it('stop', () => {
        const NUM = 2
        const CHECKNUM = 3
        let dunmmy
        const obj = reactive({ prop: 1 })
        const runner = effect(() => {
            dunmmy = obj.prop
        })
        obj.prop = NUM
        expect(dunmmy).toBe(NUM)
        stop(runner)
        obj.prop = CHECKNUM
        expect(dunmmy).toBe(NUM)

        // 调用 runner 函数
        runner()
        expect(dunmmy).toBe(CHECKNUM)

    })

    it('onStop', () => {
        const obj = reactive({ foo: 1 })
        const onStop = jest.fn()
        let dunmmy
        const runner = effect(
            () => {
                dunmmy = obj.foo
            },
            {
                onStop
            }
        )
        // 调用 runner 函数
        stop(runner)
        expect(onStop).toBeCalledTimes(1)

    })
})