> `arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])`  

`@Param callback(accumulator, currentValue, index, array)`
第一个参数是一个回调函数，数组会按照`index`升序的方式，对每一个元素都调用一次`callback`函数。  
- `accumulator`表示一个累加器，是上一次`callback`的返回值。对于第一次调用，值为`initialValue`（调用reduce时指定了这个参数）或`arr[0]`(调用reduce时没指定`initialValue`参数)。  
- `currentValue`表示这次调用callback时的当前元素。
- `index`表示这次调用callback时，当前元素的在数组中的下标。
- `array`表示数组。  

`@Param initialValue` 表示回调函数`accumulator`的初始值。  
`@Return` 返回最后一次执行`callback`的返回值。


## initialValue与callback的关系  
### 指定initialValue
1. `callback`从`index == 0`开始执行，第一次执行时`accumulator`的值为`initialValue`。
2. 指定了`initialValue`，但是数组中没有元素，则`reduce`返回`initialValue`。


### 不指定initialValue
1. 如果不指定`initialValue`, 第一次调用`callback`时，`accumulator`的值为`arr[0]`(即数组的第一个元素)，并且，从`index == 1`的位置开始执行。
2. 通过上面可以知道，如果缺省`initialValue`，那么`arr`至少有一个元素`arr[0]`。  
3. 如果仅有一个元素，并且没有指定`initialValue`，那么`callback`不会执行该，`reduce`返回这个
的元素。
