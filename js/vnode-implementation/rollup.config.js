import typescript from "@rollup/plugin-typescript"
export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/snabbdom.js',
        format: 'umd',
        name: 'snabbdom'
    },
    plugins: [typescript()]
}