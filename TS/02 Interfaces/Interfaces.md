[toc]
## Interface  
TS的核心原则之一就是通过值的`shape`来做类型检查。这也被称作`dark typing`或者`structural subtyping`   

TS中，`interface`用来给这些类型起名字。`interface`是一种定义“契约”强大的方式。  


```ts
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

`printLabel`函数有接收一个参数，要求这个参数拥有一个`string`类型的`label`属性。  

在调用这个函数时，其实传入了一个有更多属性的对象，但是编译器仅仅检查属性是否存在，以及属性类型是否匹配。  


```ts
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```
上面的例子，可以使用一个名字`LabeledValue`来描述一种“要求”（`requirement`）,他表示对象的类型，对象拥有一个类型为`string`的，`key`为`label`的属性。  

一个对象实现一个接口，不需要像其他语言一样高明确的指定。例如，在Java中实现一个接口需要使用`implement`明确指出。TS，仅仅通过形状(`shape`)来判断。


类型检查时，不要求属性的顺序一致，仅检查**是否存在**以及**类型是否匹
配**  


### Optional Properties  
接口中并不是所有的属性都是被要求的。

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

#### 注意  

继续回顾上面的例子：

例1：
```ts
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```
例2：
```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

可以看到，第一个例子中，通过添加额外的字段实现了接口；第二个例子中，包含了可选择的属性。通过这两个例子，很容易出现下面的错误：  
```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}

let mySquare = createSquare({ opacity: "red", width: 100 });
```

很简单的想法，实现这个接口时，添加一个额外的属性`opacity`，同时仅选择接口的一个属性`width`。但是这样是不行的。看一下报错信息。  

Argument of type '{ opacity: string; width: number; }' is not assignable to parameter of type 'SquareConfig'. Object literal may only specify known properties, and 'opacity' does not exist in type 'SquareConfig'.


### 过多的类型检查以及解决报错的方式
当一个对象赋值给一个**有类型**的变量时（包括函数调用时传参），就会进行类型检查。如果对象的拥有的属性中，存在一个目标类型没有的属性，就会报错。就拿上面的例子来说，参数传递的对象中，`opacity`是目标类型属性中不存在的，所以会报错。  

但是这好像与一开始举的例子有矛盾：  
```ts
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```
这个例子没有报错的原因：**赋值时没有指定类型，没有进行过多的类型检查**  
如果想要让它报错（奇怪的要求），就给变量`myObj`指定类型，这样就会进行类型检查。  
```ts
let myObj:LabeledValue = { size: 10, label: "Size 10 Object" };
//Type '{ size: number; label: string; }' is not assignable to type 'LabeledValue'. Object literal may only specify known properties, and 'size' does not exist in type 'LabeledValue'.
```

这样的错误只发生在使用对象字面量给有类型的变量赋值时才会发生。如果使用另一个变量赋值，类型检查就会变为判断属性高是否存在。


```ts
interface Named {
    name: string;
}

let x: Named;
let y = { name: 'Alice', location: 'Seattle' };
x = y;
//Ok
```

如果需要给某一个接口的实例添加额外属性，希望编译器不报错，该怎么办呢？

#### 通过类型断言（类型转换）消除类型检查错误  
还使用上面的例子，如果就是要使用`{ opacity: "red", width: 100 }`作为一个`SquareConfig`
对象，可以使用类型断言进行类型转换：  

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```
#### 使用索引签名，表示一个接口可以有任意个任意类型的属性  
上面的例子中，需要进行类型转换的原因是因为`opacity:number`不是`interface SquareConfig`的属性，因此可以将`opacity:number`声明为`SquareConfig`的一个属性来解决。如果，有一种方式，可以让`SquareConfig`包含任意个任意类型的属性，就可以不用使用`as`来解决这个问题。  


关于索引签名的内容，如果不了解可以先不看这里，接着往下看
```ts
interface SquareConfig {
  color?: string;
  width?: number;
  //有任意个任意类型的属性
  [propName: string]: any;//属性名是一个字符串类型，值是任意类型
}
```

#### 通过赋值给没有类型的变量，绕过类型检查 
```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```


### Readonly properties  
如果指定对象的某些值在创建之后就不会改变，可以通过`readonly`关键字进行修饰。  

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
//Cannot assign to 'x' because it is a read-only property.
```

TS有一个`ReadonlyArray<T>`类型，它是`Array<T>`删除了所有修改方法的版本。可以保证数组在创建后不会被修改。  

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

ro[0] = 12; // error!
//Index signature in type 'readonly number[]' only permits reading.
ro.push(5); // error!
//Property 'push' does not exist on type 'readonly number[]'.
ro.length = 100; // error!
//Cannot assign to 'length' because it is a read-only property.
a = ro; // error!
//The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.

//这里可以使用类型断言转换类型  
a = ro as number[];



console.log(a === ro);// true
//readonly仅仅是ts的类型，编译之后仍然是js，所以编译后，a和ro没区别
```

注意，`ReadonlyArray<T>`仅能保证数组只读，也就是说，数组的元素的个数、每个元素保存的引用，是不变的。但是不能保证引用指向的对象不变。  

```ts
interface Value {
    x : number;
}

let a: Array<Value> = [{x:1}];
let ro: ReadonlyArray<Value> = a;

console.log(ro[0].x = 0);
```  


#### readonly vs const  
`readonly`和`const`有一样的行为，`readonly`用在接口的属性上，`const`用在变量定义的时候。

### Function Types（定义函数签名）
除了定义对象的类型外，还可以指定方法的类型（签名）。  

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

可以看到，这个接口定义了一个方法的类型，这个方法有两个参数，参数名及类型分别为`source:string` `subString:string`（**参数名并不重要**），返回值类型为`boolean`。  

```ts
let mySearch: SearchFunc;

mySearch = function (source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};
```

这样的方式其实是定义了一个函数签名，TS的`interface`的函数签名包括：**参数个数，每个参数的类型，返回值的类型**，注意，函数签名不包括参数名。因此，在定义对应函数签名的函数时，不需要考虑参数名称的问题。（在其它语言中，函数签名还可以包括函数名）
```ts
let mySearch: SearchFunc;

//使用了SearchFunc定义的函数签名  但是参数名不同
//这里不会出现错误  因为函数签名不包括参数的名称
mySearch = function (src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};
```

TypeScript可以通过上下文推断参数的类型，举个例子：  

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

mySearch = function (src, sub) {//没有声明参数的类型和返回值类型
  let result = src.search(sub);
  return result;//这里返回了非boolean类型的值
};
//Type '(src: string, sub: string) => number' is not assignable to type 'SearchFunc'. Type 'number' is not assignable to type 'boolean'.
```
可以看到，函数表达式本身并没有声明参数类型和返回值类型，但是类型检查仍然找到了返回值类型与函数签名不符的问题。这是因为`mySearch`是有类型的，函数表达式的签名必须与`mySearch`的类型相同，否则类型检查不通过。

### Indexable Types  
就像声明函数的签名一样，还可以声明“索引”的签名（类型）。比如说，在数组中，存在类型为`number`的索引(例：`a[3]`)；在普通的对象中，存在类型为`string`的索引（例：`obj["props"]`）  

TypeScript可以声明索引的签名，用来描述这个对象可以使用什么类型的索引，以及索引对应的值的类型。  
```ts
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```
上面的索引签名描述了：**使用一个`number`类型的索引时，返回一个`string`类型的值**

#### 两种索引的类型
索引签名的索引类型支持两种类型：`number`和`string`。在一个声明中单独使用一种并没有什么特殊要求；但是如果要使用同时上述的两种签名类型，就有一个要求：**`number`索引对应的值的类型，是`string`索引对应的值的类型的子类型**。这是因为，JavaScript在使用数字索引时，会将数字转换为字符串，比如`a[100]`实际上时`a['100']`，这两种类型应该返回的是一种类型（数字索引返回子类型，子类型也可以看作是夫类型），使用数字索引时，返回的值其实是字符串索引的值（是一个父类型），数字索引的值的类型声明为子类型，就保证它返回的值一定有父类型的属性。

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

interface Test {
  [x: number]: Dog;
  [x: string]: Animal;
}

let test:Test = {};
test['100'] = {name:'Animal'};
console.log(test[100]);
//这里用数字索引  实际上JS转换为使用字符串'100'索引
```

#### 字典  
当索引签名使用`string`作为索引的类型时，要求所有的属性都要匹配这个索引签名。  

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok, length is a number
  name: string; // error, the type of 'name' is not a subtype of the indexer
}
//Property 'name' of type 'string' is not assignable to string index type 'number'.
```

上面的例子中，使用了`string`类型的索引，这个签名要求索引对应的返回值必须是`number`，`name`索引的返回值是`string`类型，这里出现了错误。

如果想要使用签名，同时又不违反上面的规则，可以使用联合类型：  

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

#### 配合readonly，声明一个ReadonlyArray  
```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
//Index signature in type 'ReadonlyStringArray' only permits reading.
```

对于所有的`readonly`的属性来说，一旦初始化完成，就不可修改。上面的例子中，数字索引都是只读的，`myArray[2] = 'Mallory'`执行时，`myArray`已经初始化完成，这次赋值不会成功。

### Hybrid Types（混合类型）  
由于JS的函数本质上也是个对象，所以函数也有自己的属性，对于这样的类型，使用`interface`的定义：  
```ts
interface Counter {
  (start: number): string;//本身是个函数  函数签名
  interval: number;//本身是个对象 对象的属性
  reset(): void;//本身是个对象 对象的方法（成员函数）
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
```

