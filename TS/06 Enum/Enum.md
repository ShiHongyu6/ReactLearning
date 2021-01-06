[toc]
### Number Enum  
```ts
enum Direction {
  Up = 1,
  Down,  // 2
  Left,  // 3
  Right, // 4
}
```
自增长  


### String Enum  
```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

### Heterogeneous Enum（异构枚举） 
```ts
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

### 枚举成员的值：常量枚举表达式或计算值

#### 常量枚举表达式  

满足下列条件之一就是常量枚举表达式：
1. 数字字面量或字符串字面量
2. 对之前定义的枚举成员的引用
3. 带括号的常量枚举表达式
4. 一元运算符`+`,`-`,`~`应用在常量枚举表达式
5. 常量枚举表达式做为二元运算符 `+`,`-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`的操作对象。 若常数枚举表达式求值后为 NaN或 Infinity，则会在编译阶段报错。

#### 计算值
除了常量枚举表达式之外，其他都是要计算的值。  
```ts
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
```

### 枚举成员都为常量枚举  




当枚举的所有成员都是**常量枚举**成员，它就会由特殊的语义：

1. 枚举成员变为了类型。
2. 枚举本身变成了每个成员的联合。

#### 枚举成员变为类型  
```ts
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
    radius: 100,
}
```

#### 枚举本身变为枚举成员的联合类型  
```ts
enum E {
  Foo,
  Bar,
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
//This condition will always return 'true' since the types 'E.Foo' and 'E.Bar' have no overlap.
    //
  }
}
```

### 运行时的枚举
枚举是一个在运行时真实存在的对象。  
```ts
enum E {
  X,
  Y,
  Z,
}
```
翻译后的JS代码

```js
var E;
(function (E) {
    E[E["X"] = 0] = "X";
    E[E["Y"] = 1] = "Y";
    E[E["Z"] = 2] = "Z";
})(E || (E = {}));
```

可以看到，运行时枚举`E`本质上是一个`E`对象。  
```ts
function f(obj: { X: number }) {
    return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

#### 数字枚举的反向映射  
```ts
enum E {
  X,
  Y,
  Z,
}
```
翻译后的JS代码

```js
var E;
(function (E) {
    E[E["X"] = 0] = "X";
    E[E["Y"] = 1] = "Y";
    E[E["Z"] = 2] = "Z";
})(E || (E = {}));
```

还拿这个例子来说，除了`E['X'] = 0`（从枚举名到枚举值）之外，还有`E[E['x'] = 0] = 'X'`也就是`E[0] = 'X'`，从枚举值到枚举名的**反向映射**。  
```ts
enum Enum {
    A
}
let a = Enum.A;
console.log(a); // 0
let nameOfA = Enum[a]; 
console.log(nameOfA); // "A"
```

### const 枚举:进作用在编译时

可以看到，普通的枚举会在运行时创建一个对象，会有一定的开销。可以使用`const`枚举，在编译时将代码中使用到枚举的地方都使用枚举值替换（有种C中`#define`的味道）。  
```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

编译后的代码：  
```js
let directions = [
    0 /* Up */,
    1 /* Down */,
    2 /* Left */,
    3 /* Right */,
];
```

编译后，`const`枚举已经被删除，使用枚举的地方都使用枚举值替换。


