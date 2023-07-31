import pkg from "./package.json" assert { type: "json" } // 断言
import typescript from "@rollup/plugin-typescript"
export default {
    input: './src/index.ts', // 指定入口文件
    output: [
        {   // 1. cjs -> commonjs
            format: 'cjs',  // 要用哪个规范打包
            file: pkg.main // 打包到那个文件及什么名字
        },
        {   // 2. esm
            format: 'es',  // 要用哪个规范打包
            file: pkg.module // 打包到那个文件及什么名字
        }
    ],
    plugins: [
        typescript()
    ]
}