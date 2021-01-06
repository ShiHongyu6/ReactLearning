[toc]

### Boolean(boolean) 
```ts
let isDone: boolean = false; 
```

### Number(number, bigint)

```ts
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;
```

### String(string)
```ts
let color: string = "blue";
color = 'red';
```

### Array(type[])

```ts
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

### Tuple(元组)
一个元素个数固定，每个位置类型固定的数组。  

```ts
let x: [string, number];
//x是一个元组
//个数固定：两个元素
//每个位置类型固定：x[0]为string类型，x[1]为number类型


x = ["hello", 10]; // OK

//类型错误的赋值
x = [10, "hello"]; // Error
//报错信息
//Type 'number' is not assignable to type 'string'.
//Type 'string' is not assignable to type 'number'.


//取出来的值类型确定 
console.log(x[0].substring(1));

//x[1]是一个number类型 没有substring()方法
console.log(x[1].substring(1));
//Property 'substring' does not exist on type 'number'.


//不可越界访问  元组的长度是一个定值
x[3] = "world";
//Tuple type '[string, number]' of length '2' has no element at index '3'.
```

### Enum  
```ts
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```
默认情况下，枚举从0开始对成员编号。可以手动设置这个值。  
```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green;
```
上面的例子展示了从1开始编号。除了自动编号外，还可以给所有的成员指定值。  
```ts
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
```

可以使用“编号”来获取枚举值的名字。  
```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
let colorName: string = Color[2];

// Displays 'Green'
console.log(colorName);
```

### Unknown  

不确定的类型。

```ts
let notSure: unknown = 4;
notSure = "maybe a string instead";

// OK, definitely a boolean
notSure = false;
```

```ts
declare const maybe: unknown;
// 'maybe' could be a string, object, boolean, undefined, or other types
const aNumber: number = maybe;
Type 'unknown' is not assignable to type 'number'.

if (maybe === true) {
  // TypeScript knows that maybe is a boolean now
  const aBoolean: boolean = maybe;
  // So, it cannot be a string
  const aString: string = maybe;
Type 'boolean' is not assignable to type 'string'.
}

if (typeof maybe === "string") {
  // TypeScript knows that maybe is a string
  const aString: string = maybe;
  // So, it cannot be a boolean
  const aBoolean: boolean = maybe;
Type 'string' is not assignable to type 'boolean'.
}
```

### Any  
不适用类型检查。  
```ts
declare function getValue(key: string): any;
// OK, return value of 'getValue' is not checked
const str: string = getValue("myString");

```

### Unknown和Any的区别  

`Unknown`：类型不确定，可以是任何类型，运行过程中进行类型检查  
`Any`：类型不确定，可以是任何类型，运行过程不进行类型检查

```ts
let looselyTyped: any = 4;
// OK, ifItExists might exist at runtime
looselyTyped.ifItExists();
// OK, toFixed exists (but the compiler doesn't check)
looselyTyped.toFixed();

let strictlyTyped: unknown = 4;
strictlyTyped.toFixed();
Object is of type 'unknown'.
```

`any`的方便是通过丢掉类型检查实现的，类型检查是`TS`的主要优势，避免使用`any`  

### Void  

没有类型。常用在返回值的类型，表示不返回任何值。
```ts
function warnUser(): void {
  console.log("This is my warning message");
}
```

如果用来声明变量，则`void`类型的变量仅有两个值可取，`undefined`、`null`(仅在`--strictNullChecks`没有被指定)  
也就是说，如果指定了`--strictNullChecks`，`void`
类型只能有一个取值:`undefined`  


### Null And Undefined  
```ts
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

默认情况下，`null`和`undefined`是其他类型的子类型。因此，可以将`null`或`undefined`赋值给其他类
型。  

然而，在使用了`--strictNullChecks`选项后，`null`和`undefined`能赋值给`unknown` `any`和它们各自的类型，除此之外，`undefined`还可以赋值给`void`

如果想要声明一个变量，允许接收`string`, `null`, `undefined`，可以使用联合类型`string | null | undefined`

```ts
let a:string | null | undefined;
let b:number = 1;
a = b;
//Type 'number' is not assignable to type 'string | null | undefined'.
```

### Never  
`never`用来表示不会返回的函数。  
- 只会抛出异常的函数
- 函数栈帧永远不会弹出的函数  

```ts
// Function returning never must not have a reachable end point
function error(message: string): never {
  throw new Error(message);
}


// Function returning never must not have a reachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

### Object  
表示一个非原始的变量，不是`number`,不是`string`，不是`boolean`，不是`bigint`，不是`symbol`，不是，`null`不是`undefined`  

使用`object`类型，类似`Object.create()`的`API`可以被更好的表示。  
```ts
declare function create(o: object | null): void;

// OK
create({ prop: 0 });
create(null);

create(42);
Argument of type '42' is not assignable to parameter of type 'object | null'.
create("string");
Argument of type '"string"' is not assignable to parameter of type 'object | null'.
create(false);
Argument of type 'false' is not assignable to parameter of type 'object | null'.
create(undefined);
Argument of type 'undefined' is not assignable to parameter of type 'object | null'.
```

### Type assertions(as 类型断言)  

类型断言更像是一种类型转换。**不会影响运行时，仅被编译器使用**  


有两种写法：  

```ts
let someValue: unknown = "this is a string";

let strLength: number = (someValue as string).length;

let strLength: number = (<string>someValue).length;

```

