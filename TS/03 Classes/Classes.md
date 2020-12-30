[toc]
## Classes
```ts
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```
和JS的语法不太一样的部分就是TS增加了成员变量的声明`greeting:string`，在JS中，是没有这部分的。  

现在看一下翻译成JS后的代码
```js
class Greeter {
    constructor(message) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
let greeter = new Greeter("world");
```
JS是没有声明部分的。  

### 继承  
```ts
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}
```
TS的继承翻译为JS几乎没有变化：  

```js
class Animal {
    move(distanceInMeters = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}
class Dog extends Animal {
    bark() {
        console.log("Woof! Woof!");
    }
}
```

### 继承与构造函数  
```ts
class Animal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}


class Horse extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}
```

这个例子比之前更加复杂，包含了构造函数的一些问题。  
1. 子类的构造函数中必须调用`super()` 
2. 在使用`this`之前，**一定**要先调用`super()`

### 访问修饰符：public 、 protected 、private  

#### public（默认值）

#### JS:#  &  TS:private  
当成员被声明为私有，类外无法访问。

新的JS语法已经包含了私有成员，就是通过`#`来标识。

```ts
class Animal {
  #name: string;
  constructor(theName: string) {
    this.#name = theName;
  }
}

new Animal("Cat").#name;
//Property '#name' is not accessible outside class 'Animal' because it has a private identifier.
```  

TS也有声明私有成员的方式：  
```ts
class Animal {
  private name: string;

  constructor(theName: string) {
    this.name = theName;
  }
}

new Animal("Cat").name;
```

通过编译后的JS代码进行比较，使用`#`，在运行时保证是私有的；使用TS的`private`，保证编译期间是私有的。  

#### protected  
被声明为`protected`的成员，只能在自己和自己的派生类中被访问。  
```ts
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch()); 
console.log(howard.name); // 错误
// Property 'name' is protected and only accessible within class 'Person' and its subclasses.
```

当一个构造器被声明为`protected`，则这个类不能在类外进行实例化。  

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee can extend Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John");
// Constructor of class 'Person' is protected and only accessible within the class declaration.
```

#### private和protected影响type  
当比较两个类型时，如果所有的成员都是`public`，则只需要比较两个类型的所有成员是否一样即可，如果一样，则`type`一样。  

但是，如果存在`private`和`protected`，情况就有所不同。如果一个类型有一个`private`声明，另一个类型有一个来自相同声明的`private`属性，才认为这个属性相同。   

就拿之前`interface extends class`的例子来说，如果一个接口继承了一个类，这个类里存在`private`属性，那么，这个接口只能由类的子类实现，这是因为子类中的`private`字段与`interface`中的`private`字段来源相同，这两个字段是兼容的（相同）；即使另一个类有相同名字的`private`属性，但是也不与`interface`中的`private`字段兼容，因为它们来源不同。  


看这个例子：
```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string; // Employee声明了一个与Animal名字相同的private name
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat"); 
let rhino = new Rhino(); 
let employee = new Employee("Bob"); 

animal = rhino; // OK Rhino是Animal的子类 
animal = employee; // Error
```
虽然`employee`的字段看起来和`animal`一样 但是存在`private`字段，这两个对象的`private`字段的来源（声明）不一样，一个实在`Animal`中，一个实在`Employee`中；对于`rhino`来说，他也有一个`private`字段，这个字段是从`Animal`继承来的，与`animal`来源相同，所以这两个`private`属性是兼容的。  

### readonly  
成员可以使用`readonly`关键字，被`readonly`修饰的成员必须在构造器中初始化。  
```ts
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;

  constructor(theName: string) {
    this.name = theName;
  }
}

let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit";
```

### Parameter Properties  
参数修饰符，就是通过在构造器参数处声明字段，并完成初始化。
```ts
class Octopus {
  constructor(readonly name: string) {}
}
```

这样的声明等价于
```ts
class Octopus {
  readonly name:string;
  constructor(name: string) {
    this.name = name;
  }
}
```

除了`readonly`，还可以使用`public`，`protected`，`private`。


### 访问器（accessor  setter/getter）  
TS支持`setter/getter`拦截对于对象成员的访问。这是一种对访问对象成员的细粒度(finer-grained)的控制方式。  

假设有这样一个类：
```ts
class Employee {
  fullName: string;
}
```

其中有一个成员`fullName`，如果想要控制`fullName`的长度，可以使用`set`访问器，当要给`fullName`设置一个比较长的值时，就会抛出异常。  

```ts
const fullNameMaxLength = 5;

class Employee {
  private _fullName: string = "";

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error("fullName has a max length of " + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee();
employee.fullName = "Bob Smith";// 抛出一个错误
```

关于访问器比较重要的两件事：  
1. 访问器要求编译器输出ES5或更高版本的JS  
2. 如果之声明了`get`而没有声明`set`，会自动推断为`readonly`

### Static Properties
同JS  

### Abstract Classes 
抽象类不能直接实例化，不想接口，抽象类可以包含成员的实现细节。`abstract`关键字被用来定义抽象类，也用来定义抽象方法。
```ts
abstract class Animal {
  abstract makeSound(): void;

  move(): void {
    console.log("roaming the earth...");
  }
}
```