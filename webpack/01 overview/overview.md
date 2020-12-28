[toc]

## concept  
- Entry
- Output
- Loaders
- Plugins
- Mode 
- Browser Compatibility 
- Environment  

### Entry  
表示一个`入口`，用来指定webpack应该从哪一个模块（`module`）开始构建内部的依赖图（`dependency graph`）。webpack会计算出那些入口直接或间接依赖的模块或库。  


例如：
```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```


### Output  
这个属性告诉webpack将打包后创建的`bundles`放在哪里（路径）以及怎样命名这些文件。  

```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### Loaders  
webpack只理解javaScript和JSON文件。`loaders`可以让webpack处理其他类型的文件，并且将他们转换成合法的模块，这样就可以在应用中使用并且将它们加入到依赖图中。

loaders有两个属性：  
- `test` ：分辨哪些文件应该被转换。
- `use`  ：使用哪个`loader`转换`test`指定的文件。  

```js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

上面的例子中，`test:/\.txt$/, use:'row-loader'`表明使用`row-loader`处理`.txt`结尾的文件，然后再将处理后的文件加入到`bundle`。   

注意，`test`如果是一个正则表达式，不要用`""`将正则表达式引起来，`/\.txt$/`表示任何以`.txt`结尾的文件；`'/\.txt$/'`和`"/\.txt$/"`表示路径为`.txt`的单个文件。

`/\.txt$/`中的`\`是转义字符，因为正则表达式中`.`是一个**特殊符号**，它的含义并不是符号`.`，想让`.`表示符号`.`，就需要使用转义字符`\.`  

### Plugins  
相较于用来转换模块的`loader`，插件（`plugin`）可以执行范围更宽的任务，例如：打包优化，组员管理、注入环境变量。  

使用插件时，需要使用`require()`，然后加入`plugins`数组。  
```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```


### Mode  
通过设置`mode`，可以启用与环境相关的webpack内置优化。`mode`有三个值可取：`development` `production` `none`。  
```js
module.exports = {
  mode: 'production'
};
```
`mode`的默认值为`production`  


### Browser Compatibility  
webpack支持所有符合ES5标准的浏览器。webpack的`import()`和`require.ensure`需要`Promise`

### Environment  
webpack 5运行在`Node.js version 10.13.0+.`  

