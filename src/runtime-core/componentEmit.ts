import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
    console.log('emit' + event);
    const { props } = instance
    const emitHandlerName = toHandlerKey(camelize(event))
    const emitHandler = Reflect.get(props, emitHandlerName)
    emitHandler && emitHandler(...args)
}