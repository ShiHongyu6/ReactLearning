[toc]
## 类定义  

`class className {}`  

`const className = class {}`

### class本质上是一个Function的实例
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
实际上，可以不指定`constructor`，初始化实例成员。
### ES6新语法

```js
class Person {
    name = 'Xiaoming';
}
```
上面提到过了，`Person`本身就是构造函数，可以直接在里面写初始化语句，但是这样有缺点，就是不能使用变量，所以`constructor`最主要的作用就是传递参数。


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

### ★不小心创建了实例成员

看下面的例子，本来像创建一个原型方法，将方法放到实例的原型中，但是由于写了一个`=`，导致这里变成了初始化一个实例成员。

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

[使用函数表达式声明的方法](使用函数表达式声明的方法.png)

可以看到，对于普通成员`name`来说，和写在构造器的区别不大，唯一的区别就是不能通过参数来指定；但是对于`sayHello`来说，变化很大。  

这里的`sayHello`使用函数表达时的方式声明，导致了`sayHello`被当成一个实例成员，而不是一个原型方法，所以`sayHello`最终作为实例本身的一个属性。<font color=#f12>在声明方法时，一定要注意这一点。</font>

## 类继承
```js
class Person{}
class Engineer extends Person{

}
```

`class`的继承使用了新的语法`extends`，但是其背后仍然使用原型链实现。  

使用`extends`关键字，可以继承任何拥有`[[Constructor]]`和原型(`prototype`)的对象。这样就可以使用`extends`继承老版本使用`function`声明的类。  



### 两条原型链：静态、实例
先看一个例子：
```js
class A {
}

class B extends A {
}

console.log(B.prototype.__proto__ === A.prototype) // true
console.log(B.__proto__ === A) // true
```

关于`B.prototype.__proto___ === A.prototype`，这个很好理解，在使用`function`声明类时，继承的时候就是要创建一个子类的原型，然后让这个原型的`[[prototype]]`指向父类的原型。  

[实例属性的原型链](继承1实例属性的原型链.png)

现在来看另一个`B.__proto__===A`，这就保证了父类的静态属性，子类也可以访问到。  

[两条原型链](两条原型链.png)

```js
class A {
    static prop_static = 3;
}

class B extends A {
}

console.log(B.prop_static);// 3
```

### 构造函数、HomeObject和super()

1. super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。  
2. super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。  

