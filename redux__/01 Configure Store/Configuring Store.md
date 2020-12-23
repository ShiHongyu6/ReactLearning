[toc]

## Creating the store  


`import {createStore } from 'redux`  
`createStore(reducer[, preloadedState][, enhancer])`

**Arguments**
- `reducer:Function`: 一个`reducer`函数，函数接收当前的`state`和一个`action`，返回下一个(更新后的)`state`
- `preloadedState` : 初始的`state`对象。如果`reducer`是通过`combineReducers()`得到的，`preloadedState`必须是一个与`combineReducers()`的参数拥有相同`shape`（即，拥有相同的属性（`key`））的普通对象。
- `enhancer:Function` : 可以指定第三方的`增强功能`（middleware, time travel, persistence等）


`createStore(rootReducer)`, which returns a `store` object.We then pass the object(`store`)to `react-redux` `Provider`component, witch is rendered at the top of our component tree.  

这确保了任何时间都可以通过`react-redux`的`connect`连接到`Redux`，因此在我们的组件中可以得到`store`。  

```javascript
import React from 'react'//使用JSX
import { render } from 'react-dom'
import { Provider } from 'react-redux'//通过该组件 Redux的store关联到我们的组件
import { createStore } from 'redux'//创建store的方法
import rootReducer from './reducers'//创建store传入的参数
import App from './components/App'//应用的顶层容器

const store = createStore(rootReducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

```
## Extending Redux functionality  

可以通过添加中间件或者增强器来扩展`store`的功能。  

中间件给`dispatch()`添加了额外的功能；增强器给`store`添加额外的功能。  

### 获取中间件和增强器  
1. 手写
2. 下载

### applyMiddleware  
通过使用`applyMiddleware()`创建一个增强器，该增强器使用参数传入的中间件。  

`middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware)`  

### compose  
通过使用`compose()`，可以将多个增强器合并。  

### 使用compose后的增强器  
```javascript
const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware)
const composedEnhancers = compose(middlewareEnhancer, monitorReducerEnhancer)

const store = createStore(rootReducer, undefined, composedEnhancers)
```

### 简单封装configureStore  
```javascript
import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}
```

这样，想要添加中间件或者增强器仅需要在`middlewares`数组和`enhancers`数组中添加即可；删除中间件也仅需要修改两个数组。  


```javascript
if (process.env.NODE_ENV === 'development') {
  middlewares.push(secretMiddleware)
}
```

像这样，可以添加仅在开发环境使用的代码  

## Integrating the devtools extension  


### install the package   

`npm install --save-dev redux-devtools-extension`  


### composeWithDevTools
`redux-devtools-extension`提供了一个`composeWithDevTools`函数，用来合并调试工具和其他增强器。

```javascript
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}
```

## Hot Reloading  

```javascript
export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
```

注意新添加有关`module.hot`的代码。  

Webpack提供一个`module.hot.accept()`，这个方法制定了哪一个`module`应该被热加载，及当这部分被修改时，应该做什么。  

在上面的例子，表示要关注`./reducers`，当它被修改时，通过使用`store.replaceReducer`更新`rootReducer`。

也可以使用相同的方法热加载React组件的任何修改：  
```javascript
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import configureStore from './configureStore'

const store = configureStore()

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/App', renderApp)
}

renderApp()

```