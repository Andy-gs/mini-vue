import { assign } from "../shared/index";

export function add(a: number, b: number): number {
    return a + b
}

type Effect = () => void
interface Runner {
    (): void
    effect: Effect
}

function run() {
    console.log('run');
}

function effect() {
    console.log('effect');
}

const runner = run
assign(runner, {effect})
console.log(runner)
