## Output  
配置`output`告诉webpack怎样将已编译的文件写到硬盘上。即使有多个`entry point`，也只有一个`output`。  

### Usage  
`output`的最少的配置是配置`output.filename`  

```js
module.exports = {
  output: {
    filename: 'bundle.js',
  }
};
```

