[toc]
## Function  

### Function Type 
给JS函数的参数和返回值加上类型：
```js
function add(x: number, y: number): number {
  return x + y;
}

let myAdd = function (x: number, y: number): number {
  return x + y;
};
```  

TS完整的函数类型（函数签名）：  
```ts
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```
完整的函数类型`(x: number, y: number) => number`，由两部分组成，参数部分使用`()`括起来，里面是参数名及类型组成的参数列表；返回值类型和参数列表中间使用`=>`连接。  

只要参数列表的参数类型匹配，就认为类型匹配，**函数签名和参数名无关**。  

### Inferring the types(contextual typing)

只要在赋值号的一边指定类型，编译器就可以计算出类型。  

```ts
// The parameters 'x' and 'y' have the type number
let myAdd = function (x: number, y: number): number {
  return x + y;
};

// myAdd has the full function type
let myAdd2: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y;
};
```

### Optional Parameters  
在JS中，可以一个函数声明的参数个数可以和调用时传入的个数不一致。但在TS中，如果不适用可选的参数，传递的参数个数要和声明的个数一致。  

如果一个参数可以在调用时不传，可以在参数后跟一个`?`，就像可选的属性一样，也可以设置可选的参数。  

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right
```

注意，可选的参数一定放在后面，就像上面的例子，`lastName?:string`不能放在`firstName:string`前。  

### Default Parameters  
如果在调用函数时没有传递参数时，希望这个参数有一个默认值，则可以如下声明：  
```ts
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
```

对于存在默认参数的函数，有默认值的参数在函数签名中显示为可选的参数：  
```ts
function buildName(firstName: string, lastName?: string):string {
    // ...
}

function buildName(firstName: string, lastName = "Smith"):string {
    // ...
}
```

上面两个函数的函数签名（类型）都是:`(fn:string, ln?:string)=>string`  

有默认值的参数和可选参数不同，有默认值的参数不必放到“后面”，如果放在前面，且要使用默认值，就需要传递`undefined`表示使用默认值。

```ts
function buildName(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}
let result4 = buildName(undefined, "Adams");     // okay and returns "Will Adams"
```

### Rest Parameters(剩余参数，其他语言称作可变参数列表) 
JS可以通过`argument`操作传入的参数，因此JS函数的参数列表本身就是不确定的。  

TS可以把所有参数收集到一个变量里：  
```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

`...restOfName:string[]`表示可以接收任意个`string`类型的参数，在函数中，`restOfName`当作一个`Array`使用即可。


### this  

#### 给`this`指定类型  

如果想要给`this`指定类型,则将`this`声明为函数的**第一个**参数,并为它指定类型.  

```ts
function f(this: void) {
    // make sure `this` is unusable in this standalone function
}
```

```ts
//在这个函数中 this的类型为Deck
createCardPicker = function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
```

### Overload  

看下面这个函数：
```ts
function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}
```

通过传入函数不同类型的参数，进入不同的分支，返回不同类型的值，这样来模拟函数的重载。但是有一个问题：**没有做类型检查**，可以看到，`pickCard`的参数和返回值类型都是`any`，没有类型检查。  


想要做类型检查，就要告知TS编译器，传入的参数类型和返回值类型的对应关系。  

```ts
function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}
```

函数的主题不用变，多加了两条函数声明，这两条函数声明就是指出传入参数的类型以及对应的返回值类型，这样编译器就可以做类型检查。