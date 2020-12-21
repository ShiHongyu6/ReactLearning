## 类定义  

`class className {}`  

`const className = class {}`

### 类本质上是一个Function的实例
```javascript
class Person{}
console.log(typeof Person); //"function"
console.log(Person.__proto__ == Function.prototype); //true
```

从上面的例子可以看到，类其实就是一个`Function`的实例，本身也是一个特殊的对象。

因为是对象，所以类本身也有属性，这里聊一下`name`属性，表示这个类的类名。  

```javascript
class A{}
console.log(A.name); // A


//如果使用类表达式创建一个类 则使用赋值表达式的左值的名字作为类的name属性的值
const B = class {}
const C = B;
console.log(C.name);// B
```

## 构造函数(构造器)

在类定义中，通过`constructor() {}`来声明一个构造器。构造器的内容主要就是声明实例成员，这一点与`function`声明的类完全一致。

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
}
```

## 原型方法  

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log("Hello, my name is " + this.name);
    }
}


let p = new Person("XiaoMing");
```
通过浏览器的控制台，可以看到对象p的详情。如图：  

[原型方法.png]

可以看到，`sayHello()`是放在对象的原型链`[[prototype]](对应图片中的__proto__)`中，相当于使用`function`声明时的`className.prototype.functionName = function() {}`。   

## 构造器外的实例成员  

除了在构造器中初始化实例成员，还可以不写构造器。

```javascript
class Person {
    name = 'XiaoMing'; //这里不用写this.name  否则会报错

    sayHello = function() {//注意这里和上面原型方法声明方式的不同， 这里使用了函数表达式， 但上面不是
        console.log("Hello, my name is " + this.name);
    }
}
let p = new Person();
```
同样，通过浏览器的控制台看一下对象p的详情。如图： 

[使用函数表达式声明的方法.png]

可以看到，对于普通成员`name`来说，和写在构造器的区别不大，唯一的区别就是不能通过参数来指定；但是对于`sayHello`来说，变化很大。  

这里的`sayHello`使用函数表达时的方式声明，导致了`sayHello`被当成一个实例成员，而不是一个原型方法，所以`sayHello`最终作为实例本身的一个属性。<font color=#f12>在声明方法时，一定要注意这一点。</font>

