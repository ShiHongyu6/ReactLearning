[toc]
## Class Types  

### 实现一个接口  
接口在面向对象的设计语言中，强制实现接口的类满足接口定义的“契约”。
```ts
interface ClockInterface {
  currentTime: Date;//实现这个接口的类必须有这个字段
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  constructor(h: number, m: number) {}
}
``` 

### 在接口中声明方法  
```ts
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

接口声明了实现类的公有成员`public`，而不是私有(`private`)和公有(`public`)。

### Difference between the static and instance sides of classes
先看一个例子
```ts
interface ClockConstructor {
  new (hour: number, minute: number):Clock;
}

class Clock implements ClockConstructor {
//Class 'Clock' incorrectly implements interface 'ClockConstructor'. 
//Type 'Clock' provides no match for the signature 'new (hour: number, minute: number): Clock'.

  currentTime: Date;
  constructor(h: number, m: number) {}
}
```
首先，在一个接口中声明了一个构造函数的签名，`new (hour: number, minute: number):Clock`；让`Clock`类实现这个接口，希望`Clock`的构造函数的签名与接口定义的一致。  

看起来没有什么问题，但是编译器报错了，给出的错误信息是`Clock`没有提供匹配`new (hour: number, minute: number): Clock`签名的成员。  

这就涉及到了静态端(`static side`)和实例端(`instance side`)的问题。

官方解释：
>  when a class implements an interface, only the instance side of the class is checked. Since the constructor sits in the static side, it is not included in this check.

实现接口时，只会检查类的实例端，构造器属于静态端。在这个例子中，实例端只有`currentTime:Date`，使用`currentTime:Date`去匹配一个方法签名显然是不匹配的。因为`Clock`中没有提供匹配接口中签名的实例端，所以就会报错。  


#### interface和构造函数  
继续回到上面的例子，一开始的想法就是想通过`interface`声明一个构造函数的签名，从而“限定”构造函数。

在上面的例子可以看到，没有办法通过实现接口的方式，下面给出一个官方文档的解决方式：  

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};
```

这段代码最难理解的地方就是`const Clock: ClockConstructor = class Clock...`。  

想要理解这一点，就需要知道JS中的`class`到底是什么
```js
class Clock {
    constructor(){
    }
}

console.log(typeof Clock);//function
console.log(Clock === Clock.prototype.constructor);//true
```
可以看到，`class`就是一个**特殊函数**。`const Clock: ClockConstructor = class Clock...`这个赋值在TS类型检查中被允许的原因是，TS认为`class Clock`这个特殊函数的签名为`new (hour: number, minute: number): ClockInterface`。

上面的解决方式用到的其实是TS中的`interface`用来指定函数的签名，对于`class`这个特殊的函数，它的签名需要在前面加一个`new`  


### Interfaces extending interfaces
官方文档关于接口继承的描述：  
> interfaces can extend each other. This allows you to copy the members of one interface into another

接口的继承就是将一个接口的成员，复制到另一个成员中。  

看一个例子：
```ts
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
```

例子中的`Square`的定义，等价于:  
```ts
interface Square {
    color : string; //copy from Shape
    sideLength : number;//own member
}
```

一个`interface`可以继承多个`interface`  
```ts
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}
```


### interfaces extending classes
接口继承一个类同样会继承它的成员（不是这些成员的实现，接口必须有实现），包括`private`和`protected`修饰的成员。  

如果接口继承了一个类的`private`和`protected`成员，那么这个接口只能由类本身或者类的子类实现。  
```ts
class Control {//有private成员的类
  private state: any;
}

interface SelectableControl extends Control {
    //继承了private state:any
  select(): void;
}

class Button extends Control implements SelectableControl {
    //Button是Control的子类 可以实现SelectableControl
  select() {}
}

class TextBox extends Control {
    //这里虽然没有显式的实现接口 但是声明了select()方法 所以 这里也实现了SelectableControl接口
  select() {}
}

class ImageControl implements SelectableControl {
//Class 'ImageControl' incorrectly implements interface 'SelectableControl'.Types have separate declarations of a private property 'state'.

    //这个类不是Control的子类  不可以实现SelectableControl接口
  private state: any;
  select() {}
}
```