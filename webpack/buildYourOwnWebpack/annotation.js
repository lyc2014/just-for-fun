const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const babel = require('babel-core')

let ID = 0
function createAsset (filename) {
    // 读取文件内容content
    const content = fs.readFileSync(filename, 'utf-8')
    
    // 将代码转为ast对象 （abstract syntax tree）
    // ast: 便于对代码的分析、优化、变更等操作
    // https://astexplorer.net/
    const ast = babylon.parse(content, { sourceType: 'module' })

    //  寻找所依赖的文件 dependencies

    const dependencies = []

    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })
    // 对代码内容进行babel转换
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['env']
    })
    // 单个文件资源处理好后赋值一个唯一id后 ID自动加1
    const id = ID++

    return {
        id,
        filename,
        dependencies,
        code
    }
}
function createGraph (entry) {
    // 入口文件asset
    const mainAsset = createAsset(entry)
    
    /**
     * 创建一个任务队列，读取到asset中的denpendencies生成对应的新的asset,
     * 并把这个新的asset push到queue队列中让队列任务继续往下跑。
     * 即通过这个逻辑解析完所有denpendencies
     */
    const queue = [mainAsset]

    for (const asset of queue) {
        const dirname = path.dirname(asset.filename)

        // 用于 依赖名字映射依赖id (modules对象的key值是id, 便于后续查找)
        asset.mapping = {}

        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath)
            const child = createAsset(absolutePath)

            asset.mapping[relativePath] = child.id
            
            // 将新的asset push进queue，让任务队列继续往下跑
            queue.push(child)
        })
    }
    return queue
}
function bundle(graph) {
    let modules = ''

    // 通过graph生成modules
    graph.forEach(mod => {
        modules += `${mod.id}: [
            function (require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)}
        ],`
    })

    /**
     * 最终结果： 一个接收modules的自执行函数 (fn(modules){....})(modules)
     * require(id) 加载 modules， 代码内容中的require(路径) 转为使用 require(id)
     * modules格式: moduleid: [fn(require, module, exports){code...}, '依赖mapping(path => id)']
     * 加载modules主要是会执行fn 传入模块所需的require（localRequire）方法，传入module module.exports对象用于接收模块的导出内容。
     */
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
    `
    return result
}
const graph = createGraph('./example/entry.js')
const result = bundle(graph)
fs.writeFile(path.resolve(__dirname, 'dist/main.js'), result, 'utf-8', (err) => {
    if (err) {
        console.error(err)
        return
    } 
    console.log('打包成功')
})
