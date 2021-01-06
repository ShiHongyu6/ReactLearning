[toc]

## Generator  

调用Generator，并不会返回定义的返回值，而是返回一个迭代器。  

```ts
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```
使用Generator返回的迭代器  

```ts
hw.next() // yield 'hello' 因为不是return 所以迭代没有结束 done==>false
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

### yield表达式

`yield`是一个“暂停标志”，每次调用`next()`时，函数执行到下一个`yield`，并且计算`yield expression`中`expression`的值，然后把这个值作为迭代结果的`value`属性。  

例如上面的例子，第一次调用`next()`，会执行到`yield 'hello'`，将`'hello'`作为返回结果的`value`属性` { value: 'hello', done: false }`  

#### 惰性求值  
Generator并不是求出所有`yield`后的表达式，然后将这些表达式的结果封装到一个迭代器中；Generator使用惰性求值，也就是说，只有运行到某个`yield`时，才会求`yield`后的值。  

```ts
function* gen() {
  yield  123 + 456;
}
```

例如，这里的`123+345`并不会立即计算，而是第一次调用`next()`时，才会计算结果，并且返回一个`value`为`579`的结果。  


#### yield表达式本身的值：next()的参数
上面讨论了`yield expression`表达式怎样处理`yield`后的表达式`expression`。接下来讨论`yield expression`本身的值。  

`yield expression`本身的值，跟计算的结果无关；而是与调用`next()`时，传入的参数有关。  

调用`next()`时可以传入一个值，这个值作为上一次执行的`yield`表达式的值。  


```ts
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);

// yield (5 + 1)
a.next() // Object{value:6, done:false}

// y = 2 * undefined
// yield (y / 3)
a.next() // Object{value:NaN, done:false}

// z = undefined
a.next() // Object{value:NaN, done:true}

var b = foo(5);

// yield (5 + 1)
b.next() // { value:6, done:false }

// y = 2 * 12
// yield (y / 3)
b.next(12) // { value:8, done:false }

// z = 13
b.next(13) // { value:42, done:true }

```
### next()、throw()和return()  
next()是将yield表达式替换成一个值。
```ts
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```
上面代码中，第二个next(1)方法就相当于将yield表达式替换成一个值1。如果next方法没有参数，就相当于替换成undefined。

throw()是将yield表达式替换成一个throw语句。
```ts
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```
return()是将yield表达式替换成一个return语句。
```ts
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

### `yield*`表达式  

#### `yield* 可迭代对象/迭代器`
是`yield*`后跟了一个迭代器或者是一个可迭代对象（有`[Symbol.iterator]`属性）。   

使用`yield * expression`就相当于：

`for(let i of expression){yield i}`

例如：
```ts
function* gen(){
  yield* ["a", "b", "c"];
}

function* gen(){
  for(let i of ['a', 'b', 'c']){
    yield i;
  }
}
```
`yield*`用来调用另一个`Generator`并且遍历返回的迭代器。  
```ts
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}
```

等同于
```ts
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}
```

#### 区分`yield`和`yield*`
注意，如果上面的例子使用`yield`而不是`yield*`：  

```ts
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"
```


#### 接收返回值  
```ts
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

### Generator作为对象属性  

```ts
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
```

等价于  

```ts
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```