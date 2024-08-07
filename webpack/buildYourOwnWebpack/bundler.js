const fs = require('fs')
const path = require('path')
/**
 * Babylon Parser: 最初是由 Babel 项目使用的 JavaScript 解析器，用于将 ECMAScript 6+ 代码解析成抽象语法树（AST）。
 * 它能够理解 JavaScript 的最新语法特性，并将其转换成一种更容易分析的形式。
 */
const babylon = require('babylon')
/**
 * babel-traverse 是 Babel 编译器工具链中的一个核心包，主要用于对抽象语法树（AST）进行深度遍历和操作。
 * 它提供了一组 API，使得开发人员可以方便地在编译过程中遍历、查询和修改 AST。
 */
const traverse = require('babel-traverse').default
const babel = require('babel-core')

let ID = 0

function createAsset (filename) {
    const content = fs.readFileSync(filename, 'utf-8')

    const ast = babylon.parse(content, { sourceType: 'module' })


    const dependencies = []

    /**
     * 遍历给定的 AST，找到所有的 ImportDeclaration 节点，并将它们导入的模块路径提取到一个数组 dependencies 中。
     */
    traverse(ast, {
        // ImportDeclaration 是 JavaScript 中的一个语法结构，用于导入模块
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })
    /**
     * 将一个给定的抽象语法树（AST）转换回 JavaScript 代码
     */
    const { code } = babel.transformFromAst(ast, null, {
        // presets: ['env'] 表示使用 Babel 的 env 预设，
        // 该预设会根据目标环境（比如浏览器、Node.js 版本）自动确定需要应用的转换规则，从而使得生成的代码能够在目标环境中运行。
        presets: ['env']
    })
    const id = ID++
    return {
        id,
        filename,
        dependencies,
        code
    }
}

function createGraph (entry) {
    const mainAsset = createAsset(entry)

    const queue = [mainAsset]

    for (const asset of queue) {
        const dirname = path.dirname(asset.filename)  //获取指定路径的目录部分

        asset.mapping = {}

        /**  [mainAsset]
     * mainAsset = {
     *                id: x,
     *                filename: absolutePath,
     *                dependencies: [relativePath1,relativePath2...],
     *                code: 代码字符串,
     *                mapping: {}
     *             }
     * => dependencies 数组遍历
     * 
     * mainAsset = {
     *                id: x,
     *                filename: absolutePath,
     *                dependencies: [relativePath1,relativePath2...],
     *                code: 代码字符串,
     *                mapping: {relativePath1: id1, relativePath2: id2, }
     *             }
     */
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath)
            const child = createAsset(absolutePath)

            asset.mapping[relativePath] = child.id
            // queue: [mainAsset]      => queue: [mainAsset, child1, child2, grandChild1, grandChild2]
            queue.push(child)
        })
    }
    return queue
}

function bundle(graph) {
    let modules = ''

    graph.forEach(mod => {
        modules += `${mod.id}: [
            function (require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)}
        ],`
    })
    // modules = '0: [function (require, module, exports) {code0}, {path1: 1, path2: 2}], 
    //            1: [function (require, module, exports) {code1}, {path3: 3, path4: 4}], '

    const result = `
        (function(modules){
            function require(id) {
                const [fn, mapping] = modules[id]

                function localRequire(relativePath) {
                    return require(mapping[relativePath])
                }

                const module = { exports: {} }

                fn(localRequire, module, module.exports)

                return module.exports
            }
            require(0)
        })({${modules}})
    ` // { 1: [function (require, module, exports) {code1}, {2: path2, 3: path3}], 2:... }
    return result
}

const graph = createGraph('./example/entry.js')
const result = bundle(graph)
fs.writeFile(path.resolve(__dirname, 'mydist/main.js'), result, 'utf-8', (err) => {
    if (err) {
        console.error(err)
        return
    } 
    console.log('打包成功')
})