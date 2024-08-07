### Simple

Loaders should do only a single task.

### Chaining

loaders can chained together. right to left, bottom to top.

### Modular

keep the output modular, like: "module.exports = 'xxxxx'"

### Stateless

not retain state between module transformations.

### Loader Utilities

using loader-utils and schema-utils
```javascript
validate(schema, options, {
  name: 'My Awesome Loader',
  baseDataPath: 'options'
});
// Invalid options object. 【My Awesome Loader】 has been initialized using an options object that does not match the API schema.
// - 【options】.maxLines should be a number.
```

### Data Sharing

```javascript
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

### Loader Dependencies 

this.addDependency(filePath). file is been watched in watch mode.


### Module Dependencies

By **transforming them** to require statements.

Using the this.resolve function to resolve the **path**.

### Common Code

extract common runtime file. like: return `module.exports = function () { runtimeFunc() }`, extract the runtimeFunc

### Peer Dependencies

like sass-loader specifies node-sass as peer dependency like so: 
```json
{
  "peerDependencies": {
    "node-sass": "^4.0.0"
  }
}
```