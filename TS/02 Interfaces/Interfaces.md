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


### 类型检查时报错及“绕开”类型检查
#### ★重要：存在可选择属性时，保证实现接口的正确
**如果要添加额外的字段，一定要保证所有的“可选择”属性都存在**，也就是说，实现`SquareConfig`要么只包含接口内的属性，如果要添加其他属性，`color`和`width`属性一定给要存在，并且类型匹配。

#### 通过类型断言（类型转换）消除类型检查错误  
还使用上面的例子，如果就是要使用`{ opacity: "red", width: 100 }`作为一个`SquareConfig`
对象，可以使用类型断言进行类型转换：  

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```
#### 表示一个接口可以有任意个任意类型的属性  
上面的例子中，需要进行类型转换的原因是因为`opacity:number`不是`interface SquareConfig`的属性，因此可以将`opacity:number`声明为`SquareConfig`的一个属性来解决。如果，有一种方式，可以让`SquareConfig`包含任意个任意类型的属性，就可以不用使用`as`来解决这个问题。  

```ts
interface SquareConfig {
  color?: string;
  width?: number;
  //有任意个任意类型的属性
  [propName: string]: any;//属性名是一个字符串类型，值是任意类型
}
```

#### 

还使用上面你的例子，现在不声明变量的类型，就不会进行过多的类型检查，因此不会报错。
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

