
[toc]
## Concepts

### state Management  
*state 管理*
>a single centralized place to contain the global state in your application, and specific patterns to follow when updating that state to make code predictable.

*单个集中式的全局state，当state更新时需要遵循特定的模式。这两点使代码的行为可以预测*

### immutability
*不变性*

>**mutating the object**, it's the same object or array reference in memory, but the contents inside the object have changed.  

*修改对象的内容（字段），被称作mutate*    

>In order to update values immutably, your code must make copies of existing objects/arrays, and then modify the copies.

*Redux期望所有的state更新都是immutably，也就是说，不要直接修改`state`对象本身，要保持`state`是不可变的（`immutably`），修改时创建一个副本，对副本进行更改*

## Terminology

### Actions  
> An action is a plain JavaScript object that has a type field. You can think of an action as an event that describes something that happened in the application.

*Action就是拥有`type`字段的普通JS对象。可以认为他是一个事件发生时的行为*

`type`是一个字符串，在一定程度上描述了对应的`action`。

`type`一般为:`"domain/eventName"`，前一部分为功能的分类，后一部分对应该功能的某个事件。    

`action`对象还有额外的字段来描述事件发生的信息，通常还会有一个被称作`payload`的字段。  

举一个`action`的例子：
```javascript
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

### Action Creators  
> An action creator is a function that creates and returns an action object. We typically use these so we don't have to write the action object by hand every time:

```javascript
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```  

一个`action`的构建器，或者说是一个`action`工厂。

### Reducers 

> A reducer is a function that receives the current `state` and an `action` object, decides how to update the state if necessary, and returns the new `state`: `(state, action) => newState`. You can think of a reducer as an event listener which handles events based on the received action (event) type.

*reducer 是一个函数，参数为当前`state`和一个`action`对象，返回值为新的`state`。reducer是一个事件监听器，处理基于`action`的事件*

#### reducer的要求

> - They should only calculate the new state value based on the state and action arguments
> - They are not allowed to modify the existing state. Instead, they must make immutable updates, by copying the existing state and making changes to the copied values.
> - They must not do any asynchronous logic, calculate random values, or cause other "side effects"


#### reducer函数的逻辑

> - Check to see if the reducer cares about this action
>    - If so, make a copy of the state, update the copy with new values, and return it
> - Otherwise, return the existing state unchanged

[reducer流程](./reducer流程.png)


```javascript
const initialState = { value: 0 }
function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/increment') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1
    }
  }
  // otherwise return the existing state unchanged
  return state
}
```

#### reducer被叫做reducer的原因
> A Redux `reducer` function is exactly the same idea as this "reduce callback" function! It takes a "previous result" (the `state`), and the "current item" (the `action` object), **decides a new state value based on those arguments, and returns that new state**.

结果仅和当前`action`上一次结果`state`有关。

```javascript
const actions = [
  { type: 'counter/increment' },
  { type: 'counter/increment' },
  { type: 'counter/increment' }
]

const initialState = { value: 0 }

const finalResult = actions.reduce(counterReducer, initialState)
console.log(finalResult)

```

> **Redux reducers reduce a set of actions (over time) into a single state.**

`Redux reducer`在一段时间内，将一组`action`减少为**单个**的状态（`state`）


### Store  

> The current Redux application state lives in an object called the store .

`store`是一个对象，存储着当前的`state`，通过`store.getState()`可以获得当前`state`  

`store`可以通过传入一个`reducer`创建：  
```javascript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())

```

### Dispatch  
`store`有一个`dispatch()`方法。唯一更新`state`的方式就是调用`store.dispatch()`，这个方法接收一个`action`对象。  
`store`将调用它的`reducer`更新`store`内部的`state`

```javascript
store.dispatch({ type: 'counter/increment' });
```


### Selectors  
`selector`用来从`store`的`state`中提取信息。  

```javascript

const selectCounterValue = state => state.value;  //定义selector

const currentValue = selectCounterValue(store.getState()) //使用selector
console.log(currentValue)
```

`state`是具有一定结构的JS对象，大多数情况要使用的不是这个“大对象”，而是这个对象中的某一个字段。`selector`用来从这个“大对象”中提取(extract)需要的部分。


## Redux Application Data Flow

### one-way data flow（单向数据流）

- `state`描述了应用某个时间点的状况（数据）
- UI根据`state`进行渲染 
- 某些事件触发，更新了`state`  
- UI根据新的`state`进行渲染  

### Redux更详细的数据流  

#### Initial setup  
*初始化配置*  
- 使用一个根`reducer`(`root reducer`)创建一个`Redux store`
- `store`调用`root reducer`，保存返回值作为初始的`state`
- UI第一次渲染时，组件使用当前的`state`。同时，在之后的某个时间，组件可以感知`state`是否改变。  

举个例子：
[初始化之后](./initial.png)

如图，根据`render`创建了有一个`store`，并且得到一个初始的`state`。  
之后，根据当前的`state`对UI进行渲染。


#### Updates  
- 某个事件被触发。 
- 给`store`发送一个`action`对象（`dispatch({type:'container/increment'})`）。
- `store`执行`reducer`函数，根据当前`state`和`action`更新`state`(作为返回值) 。  
- `store`通知所有使用了`state`的UI组件，`state`已经更新。
- 每一个从`state`取数据的UI组件判断它需要的部分是否改变。  
- 对于数据已经修改了的UI组件，会根据新的数据重新渲染（`re-render`）  


因为要接收事件，所以，要有一个监听事件的对象。这个对象的作用就是用来接收UI组件发出的事件，然后将事件封装为对应的`action`，发送给`store`。  

[监听事件](./listenEvent.png)

当一个事件触发时（在这个例子中，就是点了一个`button`），开始`Updates`流程。  
[updates.gif](/updates.gif)  

