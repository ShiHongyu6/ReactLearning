[toc]
## Application Contents   
- `/src` 
    - `index.js`：入口
    - `App.js` : 最高层的`React`组件
    - `/app`
        - `store.js` : 创建`Redux store`的实例
    - `/features`
        - `/<featureName>`
            - `<componentName>.js` : `React`组件
            - `<componentName>Slice.js` : 该组件对应的`Redux`逻辑 


### Creating the Redux Store  

#### createStore()  
`createStore(reducer[, preloadedState][, enhancer])`

**Arguments**
- `reducer:Function`: 一个`reducer`函数，函数接收当前的`state`和一个`action`，返回下一个(更新后的)`state`
- `preloadedState` : 初始的`state`对象。如果`reducer`是通过`combineReducers()`得到的，`preloadedState`必须是一个与`combineReducers()`的参数拥有相同`shape`（即，拥有相同的属性（`key`））的普通对象。
- `enhancer:Function` : 可以指定第三方的`增强功能`（middleware, time travel, persistence等）

**Returns**
- `Store`

举例：  
```javascript
import { createStore } from 'redux'

//reducer 用来表示更新state的逻辑
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      //如果是一个`ADD_TODO`事件  则给state追加元素
      return state.concat([action.text])
    default:
      return state
  }
}

//创建一个store
const store = createStore(todos, ['Use Redux'])

//触发一个事件
store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})

console.log(store.getState())
// [ 'Use Redux', 'Read the docs' ]
```

看一下`dispatch()`函数的源码
```Typescript

  function dispatch(action: A) {
  
    //仅保留好理解的部分

    try {
      isDispatching = true
                    //currentReducer就是调用createStore时传入的第一个参数
      currentState = currentReducer(currentState, action) //更新当前的state
    } finally {
      isDispatching = false
    }

    return action
  }
```

可以看到，这个函数就是调用了传入的`reducer`。这就有问题了，在实际开发中，`state`往往很复杂，要处理的事件也很多，因此需要一个很“大”的`reducer`来处理所有的事件，直接编写显然不是好的方法，Redux提供了一个`combineReducers()`来帮助生成这样一个`reducer`。

#### combineReducers()  
`combineReducers()`函数将多个不同的`reducer`合并为一个`reducer`，这个合并后的`reducer`可以传递给`createStore()`函数，以创建一个`store`实例。  


`combineReducer()`接收的参数是一个对象，最终返回一个合并后的`reducer`。通过之前的学习，可以知道`reducer`就是用来说明`state`应该怎么更新，并返回更新后的`state`，这个`state`的`shape`和`combineReducer()`参数的`shape`相同。

例如：
```javascript
rootReducer = combineReducers({
    //key ：对应的reducer
    potato: potatoReducer, 
    tomato: tomatoReducer
})


//rootReducer返回值的shape
{
  potato: {

  },
  tomato: {

  }
}
```
`combineReducer()`参数的是`{potato: potatoReducer, tomato: tomatoReducer}`，它的`shape`是`{potato:{any}, tomato:{any}}`，这个函数返回一个`rootReducer`，`rootReducer`也是一个函数，他的返回值的`shape`也是`{potato:{any}, tomato:{any}}`。


来看一段`combineReducer()`的源码：  
```Typescript
function combineReducers(reducers: ReducersMapObject) {


//省略部分源码
 return function combination(//返回一个合并后的reducer
    state: StateFromReducersMapObject<typeof reducers> = {},
    action: AnyAction
  ) {
    /**
     *这里省略了部分源码
     */

    let hasChanged = false //state是否发生了改变
    const nextState: StateFromReducersMapObject<typeof reducers> = {}  //更新后的state
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]   //取出每一个key
      const reducer = finalReducers[key] //根据key取出对应的子reducer
      const previousStateForKey = state[key] //当前state中 key对应的slice

      /**
       * 调用每一个子reducer
       */
      const nextStateForKey = reducer(previousStateForKey, action) //调用子reducer


      /**
       * key是从finalReducers中取出来的 也就是和combineReducers传如参数的shape一致的原因
       */
      nextState[key] = nextStateForKey //保存更新后的slice到新的state中

      /**
       * 这里就是为什么对state的更改必须要使用一个新对象的原因
       * 判断一个slice有没有改变就是通过引用是否改变来判断的 如果reducer没有对state做改变，
       * 会直接返回原来的state，这样这里的hasChanged就是false
       */
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey 
    }

    return hasChanged ? nextState : state //如果state更新，则返回更新后的state
  }
}
```


### configureStore()
可以使用`Redux ToolKit`提供的`configureStore()`函数创建一个`store`实例。  

这个函数封装了上面提到的`combineReducers()`和`createStore()`方法。

例（创建`store`实例`store.js`中的内容）:
```javascript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})
```   

#### Redux Slices  

`slice`直接翻译过来就是`切片`，也就是一个整体的某一部分。在`Redux`中，每个`slice`就是`state`的一个部分。

一个`slice`是一个`feature`对应的`reducer`和`action`的集合，典型的做法是将每个`slice`放在一个单独的文件中定义。  

例如：
```javascript
import { configureStore } from '@reduxjs/toolkit'
//分别从三个文件中导入三个feature对应的slice
import usersReducer from '../features/users/usersSlice'
import postsReducer from '../features/posts/postsSlice'
import commentsReducer from '../features/comments/commentsSlice'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
})
```

这里调用了`combineReducers()`创建了一个`root reducer`，即：
```javascript
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer
})
```
这就导致了`state`的`shape`与之一致。  

#### Creating Slice Reducers and Actions  
搞清楚什么是`slice`之后，来看一下`Redux ToolKit`提供的创建`slice`的方法。  

这个方法根据传递的参数，自动的生成一个`slice`（其中最主要的就是帮忙自动生成一个`reducer`）。

```javascript
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer

```

##### 奇怪的地方1：reducer没有判断type  
因为`dispatch(action)`函数最终调用了`root reducer`。

`root reducer`一般又是通过`combineReducers()`函数得到的，`root reducer`处理的方式就是调用所有的子`reducer`。  

对于每一个子`reducer`，都会处理不同的`action`，因此，`action`应该由哪个`reducer`处理，需要有一个属性来指示，这个属性就是`type`。  

前面一个例子的怪异之处就是没有提到任何关于`type`的事情，原因是因为`createSlice`进行了封装。  

上例中，`reducers`指示了该`slice`的`reducer`处理三种事件。`"increment"`、`"decrement"`和`"incrementByAmount"`。`action`的`type`属性是一个字符串，一般包括两个部分，但是这三个字符串表示第二部分，第一部分也需要指定，那就是参数中的`name`属性。    

总之，`name`和`reducers`属性，用来生成一个`slice`中的`reducer`，`reducer`处理的`action`的`type`，通过`name`与`reducers`属性的`key`来确定。  

就拿上面的例子来说，生成了<font color=#f12>看起来像</font>下面一样的`reducer`：  

```javascript
function reducer(state, action) {
    //省略更新state的逻辑
    switch(action.type) {
        case "counter/increment" : ;
        case "counter/decrement" : ;
        case "counter/incrementByAmount" : ;
        default : return state;
    }
}
```

##### 奇怪的地方2：reducer更新state的方式修改了对象本身  
修改`state`对象时，不应该直接修改`state`对象本身，而是创建一个副本，更新副本之后再将副本返回。  

再看上面的例子，直接使用箭头函数更改了`state`对象。  
其实在注释中也看到了，虽然使用了mutating的逻辑，但是会自动生成一个immutably的`reducer`（其实这样说并不准确，但是好理解，事实上使用了`Immer`库，使用了代理（`Proxy`）。这样就可以更多的关注逻辑，而不是怎样生成`state`。  

##### 指定state的初始值  
参数的对象包含三个属性`name`和`reducers`已经说完，接下来就是`initialState`，这个属性就是指定了`state`的初始值，

在第一次调用`reducer`时，并没有一个当前的`state`，所以要指定一个`state`供第一次调用时使用。  

所以，`createSlice()`最终生成的`reducer`<font color=#f12>看起来像</font>：  

```javascript

const initialState = {...};
function reducer(state = initialState, action) {
    //省略更新state的逻辑
    switch(action.type) {
        case "counter/increment" : ;
        case "counter/decrement" : ;
        case "counter/incrementByAmount" : ;
        default : return state;
    }
}
```

<font color=#f12>注：并没有生成上面写的`switch-case`的函数，这样举例子只是为了好理解。</font>  

##### action工厂  
`slice`对象一共有四个属性

```Typescript
  return {
    name,
    reducer,
    actions: actionCreators as any,
    caseReducers: sliceCaseReducersByName as any
  }
```  
`name`和`reducer`都已经熟悉，接下来看一个`actions`  

它是一个`action`的工厂(`creator`)。  

```javascript
/*
reducers: {
  increment: state => {
    state.value += 1
  },
  decrement: state => {
    state.value -= 1
  },
  incrementByAmount: (state, action) => {
    state.value += action.payload
  }
}
*/

console.log(counterSlice.actions.increment())
// {type: "counter/increment"}
```

## React组件与Redux交互  

需要中间件`react-redux`。

### providing the store  
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

这样，在`<App />`组件中才可以使用`store`（或`hooks`）

#### 获取store.dispatch()  
```javascript
const dispatch = useDispatch() //获取dispatch
dispatch(increment()) //使用
```

#### useSelector(selector)  
参数`selector`就是从`store`的`state`中提取特定的部分。  
```javascript
export const selectCount = state => state.counter.value
```

通过`useSelector`获取数据`state`中的数据
```javascript
const count = useSelector(selectCount)
```

> Any time an action has been dispatched and the Redux store has been updated, useSelector will re-run our selector function. If the selector returns a different value than last time, useSelector will make sure our component re-renders with the new value.



### 使用Thunk编写异步逻辑    

#### 不好的处理方式
注意，`reducer`本身不能包含异步逻辑，但是如果有需要异步处理的逻辑，应该怎么办？<font color=#f12>**异步调用dispatch()**</font>  

虽然`reducer`本身不可以有异步逻辑，但是可以异步调用`dispatch()`，从而实现异步调用`reducer`。   

```javascript
<button onClick={
    () =>{setTimeout(() => dispatch(increment()), 1000);}
}/>
```

很显然，这样写并不好，组件的事件处理的逻辑已经简化为`dispatch(action)`这样的方式，在异步处理时，不应该添加额外的逻辑。  

#### thunk
中间件`redux-thunk`提供了一种`thunk`函数的写法，来解决异步逻辑的问题。`redux-thunk`是中间件，因此在使用创建`store`时（调用`createStore()`），要传入中间件的参数。如果使用`configureStore()`，这回自动引入这个中间件。  

`thunk`是一种可以包含一部逻辑的Redux函数。通过两个函数来实现：  
- 一个内部的`thunk`函数，这个函数接收两个参数`dispatch`和`getState`  
- 一个外部的`thunk`函数工厂，返回内部的`thunk`函数。  

```javascript
// the outside "thunk creator" function
const fetchUserById = userId => {
  // the inside "thunk function"
  return async (dispatch, getState) => {
    try {
      // make an async call in the thunk
      const user = await userAPI.fetchById(userId)
      // dispatch an action when we get the response back
      dispatch(userLoaded(user))
    } catch (err) {
      // If something went wrong, handle it here
    }
  }
}
```
在使用时，就可以像同步方法一样使用。  

```javascript
store.dispatch(fetchUserById(1));
```