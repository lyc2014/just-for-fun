## simple webpack

通过一个简易版本的webpack打包器来学习webpack打包流程。

### 源文件目录

创建源代码文件目录

```javascript
//  example/entry.js
import message from './message.js'
console.log(message)

//  example/message.js
import  { name } from './name.js'
export default `hello ${name}`

// example/name.js
export var name = 'YuanCheng Li'
```

### 实现思路

1. 读取文件资源，构建一个文件资源对象，对象包含：代码内容code、 依赖的文件 dependencies、文件名filename、文件唯一码id。
2. 通过入口文件entry.js将依赖的文件都读取出来，构建出一个依赖图graph，依赖关系通过文件id串联起来。
3. 将依赖graph转换为modules对象, modules格式:
```javascript
{
    '文件id(即ModuleId)': [function (require, module, exports) {
        // 文件代码内容....
    }, '依赖文件']
}
// 文件id: [fn, '依赖']
```
4. 实现一个本地require方法，文件代码内容中的require(filename)转为加载modules对象中的module(注释：代码内容会先通过Babel转换，import会转换为require)

### 所需依赖包

```javascript
const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const babel = require('babel-core')
```

### createAsset

```javascript
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
console.log(createAsset('./example/entry.js'))
/**
 * {
        id: 0,
        filename: './example/entry.js',
        dependencies: [ './message.js' ],
        code: '"use strict";\n' +
            '\n' +
            'var _message = require("./message.js");\n' +
            '\n' +
            'var _message2 = _interopRequireDefault(_message);\n' +
            '\n' +
            'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' +
            '\n' +
            'console.log(_message2.default);'
   }
 */
```

### createGraph

```javascript
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
console.log(createGraph('./example/entry.js'))
/**
 * [
        {
            id: 0,
            filename: './example/entry.js',
            dependencies: [ './message.js' ],
            code: '"use strict";\n' +
            '\n' +
            'var _message = require("./message.js");\n' +
            '\n' +
            'var _message2 = _interopRequireDefault(_message);\n' +
            '\n' +
            'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' +
            '\n' +
            'console.log(_message2.default);',
            mapping: { './message.js': 1 }
        },
        {
            id: 1,
            filename: 'example\\message.js',
            dependencies: [ './name.js' ],
            code: '"use strict";\n' +
            '\n' +
            'Object.defineProperty(exports, "__esModule", {\n' +
            '  value: true\n' +
            '});\n' +
            '\n' +
            'var _name = require("./name.js");\n' +
            '\n' +
            'exports.default = "hello " + _name.name;',
            mapping: { './name.js': 2 }
        },
        {
            id: 2,
            filename: 'example\\name.js',
            dependencies: [],
            code: '"use strict";\n' +
            '\n' +
            'Object.defineProperty(exports, "__esModule", {\n' +
            '  value: true\n' +
            '});\n' +
            "var name = exports.name = 'YuanCheng Li';",
            mapping: {}
        }
    ]
 */
```

### bundle

```javascript
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
```

### 将result内容写入到main.js中输出

```javascript
const graph = createGraph('./example/entry.js')
const result = bundle(graph)
fs.writeFile(path.resolve(__dirname, 'dist/main.js'), result, 'utf-8', (err) => {
    if (err) {
        console.error(err)
        return
    } 
    console.log('打包成功')
})
```

### 总结

通过简易的webpack实现流程，可以帮助我们更好的理解学习webpack, 例如我们更清楚的、通过代码形式理解了文档中提到的module和dependencies具体是什么东西了。

### main.js文件内容：

```javascript

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
        })({0: [
            function (require, module, exports) {
                "use strict";

var _message = require("./message.js");

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_message2.default);
            },
            {"./message.js":1}
        ],1: [
            function (require, module, exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _name = require("./name.js");

exports.default = "hello " + _name.name;
            },
            {"./name.js":2}
        ],2: [
            function (require, module, exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var name = exports.name = 'YuanCheng Li';
            },
            {}
        ],})
    
```