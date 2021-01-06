[toc]

### let

声明一个块级作用域的变量。

```js
{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1
```


#### 不存在变量提升

```ts
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

#### 暂时性死区

```ts
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

```ts
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错
```

上面代码中，调用bar函数之所以报错（某些实现可能不报错），是因为参数x默认值等于另一个参数y，而此时y还没有声明，属于“死区”。如果y的默认值是x，就不会报错，因为此时x已经声明了。

```ts
// 报错
let x = x;
// ReferenceError: x is not defined
```

#### 不允许重复声明  
同一个代码块不能重复声明同样的块级作用域变量

```ts
// 报错
function func() {
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  let a = 10;
  let a = 1;
}
```  

### 块级作用域中声明函数  

ES5中，函数只能生命在顶层作用域和函数的代码块中。  
ES6中，函数可以生命在一个代码块中，这个函数在该代码库啊哎块作用域之外不能引用。

### const  

#### 简单类型  
不可修改。

#### 引用类型  
保存的引用不能改变，也就是指针的指向不变，并不能保证指向的对象中的属性不变。

### 顶层对象  
在浏览器环境中，顶层对象是`window`；NodeJS中是`global`对象。全局变量是顶层对象的一个属性。  

#### 全局变量与顶层对象脱钩  
ES6中，使用`var`和`function`声明的全局变量，仍然是顶层对象的属性。  

`let`、`const`和`class`声明的全局变量，不是顶层对象的属性。  

```ts
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```