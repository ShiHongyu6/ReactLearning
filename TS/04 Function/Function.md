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