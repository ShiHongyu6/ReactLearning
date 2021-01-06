### Generic Constraints（泛型约束）  
```ts
interface Lengthwise {
  length: number;
}


//T extends Lengthwise表示T是Lengthwise的子类型 也就是T中有一个length属性
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```  

#### 泛型约束中使用参数的属性作为类型  

```ts


function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];

  //keyof {a:number, b:number, c:number, d:number} ===> 'a' | 'b' | 'c' | 'd'
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
//Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.

```

### 泛型中使用class类型    
当使用TypeScript泛型创建工厂时，需要引用`class`的构造器：  

```ts
function create<T>(c: { new (): T }): T {
  return new c();
}
```
```ts
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```