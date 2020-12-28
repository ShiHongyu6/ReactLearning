[toc] 

## Entry Points

### single entry (Shorthand) syntax  

`Usage: entry: string | [string]`  

```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```  
上面是一个简写的语法，它的完整写法是：  

```js
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```

`entry`的值还可以是一个路径数组，这会创建`multi-main entry`。当你向注入多个依赖的文件，并且将他们的依赖加入到“chunk”中是有用的。  

```js
module.exports = {
  entry: [ 
    './src/file_1.js',
    './src/file_2.js'
  ],
  output: {
    filename: 'bundle.js'
  }
};
```

`entry: string | [string]`这样的单入口写法可以快速地配置，但是在扩展配置方面缺乏灵活性。  

### Object Syntax  

`Usage: entry: { <entryChunkName> string | [string] } | {}`  

```js
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
};
```

对象语法更加的冗长，但是，这是最大程度上可扩展的配置方式。

### Scenarios(场景、情景)  
给出一些`entry`配置的例子  

#### separate App（应用and Vendor（第三方库） Entries

webpack.config.js  
```javascript
module.exports = {
  entry: {
    main: './src/app.js',
    vendor: './src/vendor.js'
  }
};
```

这样，可以在`vender.js`中导入库和文件（例如：Bootstrap，jQuery，图片）等，它们将被打包到各自的chunk中。  


#### Multi Page Application  
```js
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```  

创建三个独立的依赖图。  

