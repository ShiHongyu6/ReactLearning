[toc]  

### class内声明的原型方法不可枚举  
```ts
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

```

### 构造器可以返回另一个类型的对象（离谱）  
```ts
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
```


### new.target  

函数中使用`new.target`，如果函数通过`new`调用，则`new.target`指向函数；如果不通过`new`调用函数（即，直接调用），则`new.target`为`undefined`
```ts
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); 
var notAPerson = Person.call(person, '张三');  
```
