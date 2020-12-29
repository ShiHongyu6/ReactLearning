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
一个装饰器是一种特殊的声明，可以附加在**类声明，方法，访问器（accessor），属性，参数**之前。装饰器使用`@expression`的形式，`expression`计算的结果一定是一个函数（`function`），这个函数将在运行时被调用，调用时可以获被修饰的声明的信息。

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

类装饰器不能被用在一个声明文件里