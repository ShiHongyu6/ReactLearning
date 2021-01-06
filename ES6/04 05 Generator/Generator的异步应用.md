[toc]
## Generator的异步应用   
在实现异步操作时，离不开的一个方法：回调函数。  

每当进行异步操作时，都需要传入回调函数，当异步操作进行到某个阶段时，就会触发该回调函数。  

### 使用Generator封装异步操作  
```ts
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
```

执行上面的异步操作：  
```ts
var g = gen();
var res = g.next(); // 启动异步操作 将结果封装到{value, done}中
// fetch返回一个Promise 所以res.value是一个Promise
// 因为yield的效果 所以还在暂停 等待next()的调用恢复执行
// 当res.value指向的Promise的状态变为resolved时 表示已经获取到数据 可以恢复执行
res.value.then(responseData => {
  return responseData.json();
}).then(dataJson => {
  g.next(dataJson); // 调用next恢复执行 并且将结果传入
});
```

上面的例子中仅有一个`yield`表达式，如果有多个`yield`表达式，`Promise`的操作可能会很长。虽然在Generator中，写了看起来像同步方法一样的异步操作，但是在执行时，仍然编写了大量的`Promise`。所以，接下来就要想办法让Generator自动执行。  

### 自动执行Generator  
对于Generator中的每个异步操作，都会使用`yield`表达式等待异步操作结束后，调用`next()`执行之后的步骤。  

也就是说，对于每个异步操作完成后的回调函数来说，它们的操作很简单，就是调用`next()`，恢复执行。   

```ts

function f(a, b, callback){
  var sum = a + b;
  setTimeout(callback, 0, sum); // 不能直接调用callback
  // callback中会调用next()
  // 如果直接调用callback 则next()就会被“再次”调用 导致出现错误
  // 通过setTimeout方法 将callback添加到事件循环中 这次next()调用结束
  // 当callback被异步调用时 上一次next()已经结束
}

var gen = function* (){
  var r1 = yield f(1, 2, cb);

  var r2 = yield f(3, 4, cb);
};

// 计算完成后 执行的回调
var cb = function(sum) {
  console.log(sum);
  g.next(sum);
}

var g = gen();
g.next();
```

上面的代码可以时Generator自动执行，但是也不是好的解决方法，没必要将`callBack`和`g`写到外面出来，最好的办法是封装一个函数，这个函数接收一个`Generator`，然后执行`Generator`。  

现在需要解决第一个问题，在上面的例子中，如果要将`callBack`隐藏，那么`yield fs.readFile('/etc/fstab', callBack)`的`callBack`参数怎么处理？  

#### Thunk函数  
引入Thunk函数的作用，就是将函数传递参数的过程分成两次。第一次传递非回调函数，第二次传递回调函数。  

还那上面的例子，`fs.readFile('/etc/fstab', callBack)`接收两大类型的函数，非回调函数和回调函数。  

Thunk函数其实就是传递了非回调函数后，没有传递回调函数的函数：  

```ts
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

// 将参数传递分为两次
var readFileThunk = Thunk(fileName); // 传递非回调函数
readFileThunk(callback); // 传递回调函数
```

#### Thunkify模块  
Thunkify模块是一个将函数转换为Thunk函数的通用模块。  
`$ npm install thunkify`

转换后的函数需要两次调用，第一次调用传入非回调函数构成的参数列表，第二次调用传入回调函数。
```ts
function thunkify(fn) { // 传入要转换的函数
  return function() { // 第一次调用 这个函数接收非回调函数
    var args = new Array(arguments.length); // 非回调函数保存在arguments中
    var ctx = this; // 记录调用上下文 后续将使用闭包传递

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i]; // 非回调函数构成的参数列表 后续通过闭包传递
    }

    return function (done) { // 第二次调用 传入回调函数done
      var called;

      args.push(function () { // 防止回调函数多次调用
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args); // 将两次调用整合
      } catch (err) {
        done(err);
      }
    }
  }
};


function f(a, b, callback){
  var sum = a + b;
  callback(sum);
  callback(sum);
}

var ft = thunkify(f);
ft(1, 2)(console.log);
```
#### 使用thunkify模块
有了Thunkify模块，就可以在调用时传递回调函数，最开始的例子可以改成：  
```ts
function f(a, b, callback){
  var sum = a + b;
  setTimeout(callback, 0, sum);
}

var ft = thunkify(f);

var gen = function* (){
  var r1 = yield ft(1, 2);

  var r2 = yield ft(3, 4);
};
```

Generator已经构造完毕，接下来写这个Generator的运行函数：  
```ts
function run(generator) {
  
  let g = generator(); // 拿到迭代器 
  
  function addCallBack(sum) { 
    let res = g.next(sum); // 拿到yield表达式封装的结果 value为需要传回调函数的thunk
    !res.done && res.value(addCallBack); // 传递回调函数调用
    // 这里的res.value()就是调用ft()()  在generator中，第一次传递参数已经完成 这里是第二次传递参数
    // 与开始的例子不同 开始的例子中 在generator中完成调用 而在这里 是在run中完成调用
    // 因为generator中的每一个yield表达式传递出来的value都需要添加一个回调 所以这里是“递归”的形式

    sum && console.log(sum);
  }
  // 上述两个声明在run()函数内 而不是在外面 解决了之前的问题
  

  addCallBack(); // 开始执行z
}

```

#### 通用执行器co  

来看一下co的源码

```ts
function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);

  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function(resolve, reject) {
    //co最终返回一个Promise
    if (typeof gen === 'function') gen = gen.apply(ctx, args); // 取到迭代器
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    // 开始执行 这里onFulfilled可以理解为上一个Promise已经解决
    onFulfilled();

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */
    function onFulfilled(res) {
      // 上一个Promise解决后 将它的值传递到res
      var ret;
      try {
        ret = gen.next(res); // 执行迭代器下一步操作
        // 拿到迭代结果后 处理下一个任务
      } catch (e) {
        return reject(e);
      }
      next(ret); // 执行下一个任务 将当前任务传递过去 封装成一个Promise
      return null;
    }

    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * Get the next value in the generator,
     * return a promise.
     *
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */
    function next(ret) {
      if (ret.done) return resolve(ret.value);
      // 将value包装成一个promise 这个Promise可能还没有resolved
      var value = toPromise.call(ctx, ret.value);
      // 将包装好的Promise返回 调用then方法
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}

// 下面是thunk转换为Promise的函数

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) { // 传递回调函数并调用
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res); // 回调函数被调用时 说明异步任务完成 调用resolve
    });
  });
}

```  

执行过程：  
1. 当前任务通过`gen.next()`返回的`value`获得。  
2. 将当前任务包装成一个`Promise`，该`Promise`状态变为`resolve`之后，执行步骤1。
