[toc]
## Decorators  

由于目前是一项实验性的功能，在编译时需要指定额外的选项  
```cmd
tsc --target ES5 --experimentalDecorators
```
或者在`tsconfig.json`文件中指定  
```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

### Decorators
一个装饰器是一种特殊的声明，可以附加在**类声明，方法，访问器（accessor），属性，参数**之前。装饰器使用`@expression`的形式，`expression`计算的结果**一定**是一个函数（`function`），这个函数将在运行时被调用，调用时可以获被修饰的声明的信息。

```ts
function sealed(target) {
  // do something with 'target' ...
}
```

### Decorator Factories  
如果想要自定义装饰器怎样被应用到一个声明，可以写一个装饰器工厂（`Decorator Factory`）。装饰器工厂是一个函数，返回一个（函数）表达式，在运行时被调用。  

```ts
function color(value: string) {
  // this is the decorator factory

  return function (target) {
    // this is the decorator
    // do something with 'target' and 'value'...
  };
}

@color('red') 
x
```
`@color('red')`是一个装饰器的工厂，他仍然符合上面说的`@expression`。这里的`expression`就是调用`color('red')`，调用的结果（返回值）是一个函数，这个被返回的函数将在运行时被调用。


### Decorator Composition （复合装饰器）
一个声明可以附加多个装饰器：  
- 单行
```ts
@f @g x
```
- 多行
```ts
@f
@g
x
```

TypeScript计算多个装饰器的步骤：  
1. 从上到下计算每一个表达式。
2. 从下到上调用每一个表达式的结果（表达式的结果是函数）。  

如果使用装饰器工厂，就可以观察到这个计算步骤：  

```ts
function f() {
  console.log("f(): evaluated");
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("f(): called");
  };
}

function g() {
  console.log("g(): evaluated");
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("g(): called");
  };
}

class C {
  @f()
  @g()
  method() {}
}

/*运行结果
f(): evaluated
g(): evaluated
g(): called
f(): called
*/
```

### Class Decorators
类装饰器附加在一个类声明的前面。类装饰器被应用到类的构造器，并且可以用来观察、修改或者替换一个类的定义。

类装饰器不能被用在一个声明文件里。  

#### 参数
在**运行时**，类装饰器的表达式会作为函数被调用，被修饰的类的构造函数，作为装饰器表达式调用的参数。  

注意，`class`是一个特殊的函数
```ts
class A {
  constructor(){
    console.log('construct instance of class A');
  }
}
```
相当于
```ts
function A {
  console.log('construct instance of class A');
}
```
也就是说，在JS中，类本身就是它的构造函数，上面提到的在运行时传递构造函数，其实传递的就是类本身。  

```ts
// 这里的泛型指出 T 是一个 构造函数签名 的子类型
// 也就是说  T 是一个构造函数
// T可以是一个类的类名
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  console.log(constructor);
}

class A {
}
classDecorator(A);
// log: class A {} 
```
可以看到，使用的泛型T保证T是一个构造函数，在使用时，传入一个类，这也就证明了其实类本身就是它的构造函数。


#### 返回值
如果类装饰器返回一个值（**类表达式**），会替换掉类声明。替换类声明本质上是替换了构造函数`constructor`，在原来类中声明的  

```ts
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

console.log(new Greeter("world"));
//hello:override
```
这里可以看到，返回的类（构造函数）替换（override）了原本的构造函数。  

`class extends constructor`需要继承的原因：这里完全可以直接返回一个`class`表达式。  

但是，如果直接返回一个`class`表达式，这个新的`class`就和原来的没有任何关系，为了通过类型检查，新的`class`必须声明和原来的`class`相同的成员，这样，即使只是想override其中某些成员、或者注入一些东西，也必须把那些没有修改的部分原样写一遍，大可不必。  
```ts
function classDecorator<T extends { new (...args:any[]): any }>(
  constructor: T
) {
  return class{
    newProperty:string;
    hello:string;
    property:string;
    constructor(m:string){
      this.property = "property";
      this.newProperty = "new property";
      this.hello = "override";
    }
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}
```
这就相当于重新写了一个类，传入的类(构造函数)没有起到任何作用。所以，更好的写法就是继承被装饰的类，然后override或者injection（注入）。


#### 通过装饰器调用react-redux的connect  
```ts
@connect(mapStateToProps)//仅需要在这里调用即可
class Component {

}
```
`connect`方法就是一个装饰器工厂，`connect(mapStateToProps)`执行后，返回一个函数（表达式）*（这里是React-Redux的内容）*，这个函数接收一个参数（React组件，是一个`class`），刚好符合类装饰器的表达式调用时，会将类传入。`connect()`返回的包装器调用后返回一个注入`props`之后的`class`，由于使用了装饰器，这个返回的`class`替换了被修饰的`class`。与我们在后面调用`connect()(Component)`的行为完全一致（妙啊~）。  

### Method Decorator

附加在一个方法声明的前面，会被应用到方法的属性描述符`descriptor`。


#### 参数

1. `target`:如果是一个静态`static`方法，则为class的构造函数（也就是类本身）；如果是一个实例方法，则为`class.prototype`。也就是说，这个方法**存储的地方**。  
2. `name/propertyKey`:被装饰的成员的名字（键）。
3. `descriptor`:成员的属性描述符。  

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)//装饰器工厂 返回一个函数 将greet修改为不可枚举
  greet() {
    return "Hello, " + this.greeting;
  }
}

function enumerable(value: boolean) {
  //装饰器要执行的表达式（函数）
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    //观察三个参数
    console.log(`target:${target}`);
    console.log(`propertyKey:${propertyKey}`);
    console.log(`descriptor:${descriptor}`);
    //这个装饰器表达式的功能  更改描述符中的enumerable属性
    descriptor.enumerable = value;
  };
}
```

#### 返回值  
如果返回一个值，则用这个值替换属性描述符(`Property Descriptor`)  

对于上面的例子，直接在原本的访问属性描述符上修改；也可以通过返回值的方式，替换原来的属性描述符。  
```ts

function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) :PropertyDescriptor{

    return {
        writable : true,
        enumerable : value,
        configurable : true,
    }
  };
}
```

### Accessor Decorators  
访问器修饰器附加在访问器的声明之前，应用在访问器的属性描述符上。

### 参数

1. `target`:如果是一个静态`static`方法，则为class的构造函数（也就是类本身）；如果是一个实例方法，则为`class.prototype`。也就是说，这个方法**存储的地方**。  
2. `name/propertyKey`:被装饰的成员的名字（键）。
3. `descriptor`:成员的属性描述符。  

```ts
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}


function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

```

#### 返回值  
如果返回一个值，则使用这个值替换属性描述符。  

### Property Decorators

#### 参数  
1. `target`:`target`:如果是一个静态`static`方法，则为class的构造函数（也就是类本身）；如果是一个实例方法，则为`class.prototype`。
2. `name`:成员的名字。  

属性描述符没有被当作一个参数传递给装饰器。因为在定义原型对象的属性时，没有办法描述实例属性的机制，也没有获取和修改该属性初始化程序的方法。**返回值也会被忽略**。


### Param Decorators  
参数修饰器附加在参数声明之前，参数修饰器被应用到方法/构造器上。  

#### 参数  
1. `target`:`target`:如果是一个静态`static`方法，则为class的构造函数（也就是类本身）；如果是一个实例方法，则为`class.prototype`。
2. `name` : 成员的名字（**注意，这里时成员方法的名字，不是参数本身的名字**）。  
3. `parameterIndex` : 被装饰参数在参数列表中的索引。

```ts
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet(@required name: string) {
    return "Hello " + name + ", " + this.greeting;
  }
}

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number){
    console.log(`target:${target}`);
    console.log(`propertyKey:${String(propertyKey)}`);
    console.log(`parameterIndex:${parameterIndex}`);
}
```