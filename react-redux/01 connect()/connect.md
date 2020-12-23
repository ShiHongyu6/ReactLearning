[toc]

## connect()  

`connect()`函数连接一个`react component`和`redux store`。

这个函数不会修改传入的组件，而是返回一个新的、被连接的组件类，这个类封装了传入的组件。  

```javascript
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```
`mapStateToProps`和`mapDispatchToProps`是两个回调函数，分别处理Redux `store`的`state`和`dispatch`。`state`和`dispatch`作为我们提供的`mapStateToProps`和`mapDispatchToProps`的第一个参数。

`mapStateToProps`和`mapDispatchToProps`的返回值分别被用于第三个回调`mergeProps`的第一个和第二个参数，`mergeProps()`的第三个参数为`ownProps`。`mergeProps()`返回的结果被称作`mergeProps`，将会提供给被连接的组件。  

### Parameters 
1. `mapStateToProps? : Function`
2. `mapDispatchToProps? : Function | Object`
3. `mergeProps? : Function`
4. `options? : Object`

#### mapStateToProps?:(state, ownProps?) => object  

如果该参数被指定，新的被包装的组件将关注`Redux store`的更新。也就是说，一旦`store`被更新，`mapStateToProps`就会被调用。`mapStateToProps`的返回值一定是一个简单对象，这个对象将会被整合到被包装的组件的`props`中。

如果不想关注`store`的更新，在`mapStateToProps`的位置传入`null`或`undefined`。  

##### @Param state  
如果自定义的`mapStateToProps()`函数只接收一个参数，在`store state`改变时，`mapStateToProps()`就会被调用，并且`store state`作为第一个参数。  

##### @Param OwnProps  
如果自定义的`mapStateToProps()`函数接收两个参数，在`store state`改变时，或者被包装的组件收到了新的`props`(基于浅比较(===))时，`mapStateToProps()`会被调用，`store state`作为第一个参数，被包装的组件的`props`作为第二个参数。  

##### @return  
返回值是一个对象，这个对象将会被整合到被包装组件的`props`中，如果指定了`mergeProps`，`mapStateToProps`的返回值被当作参数传递给`mergeProps`。  

`mapStateToProps`的返回值决定了组件是否`re-render`。React Redux内部实现了`shouldComponentUpdate`方法，在组件需要的数据改变时，组件会`re-render`。默认情况下，React Redux判断`mapStateToProps`返回的对象的内容是否与之前（`stateProps`）不同，判断的方式是使用`===`对每一个属性进行比较。如果有任何一个属性改变，组件将被`re-render`。

<table><thead><tr><th></th><th><code>(state) =&gt; stateProps</code></th><th><code>(state, ownProps) =&gt; stateProps</code></th></tr></thead><tbody><tr><td><code>mapStateToProps</code> runs when:</td><td>store <code>state</code> changes</td><td>store <code>state</code> changes <br> or <br>any field of <code>ownProps</code> is different</td></tr><tr><td>component re-renders when:</td><td>any field of <code>stateProps</code> is different</td><td>any field of <code>stateProps</code> is different <br> or <br> any field of <code>ownProps</code> is different</td></tr></tbody></table>


#### mapDispatchToProps?: Object | (dispatch, ownProps?) => Object  

默认情况下，如果不传递这个参数，组件的`props`会被注入`store.dispatch`，这样，在组件中就可以调用`dispatch()`  

```javascript
function Counter({ count, dispatch }) {
  return (
    <div>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>reset</button>
    </div>
  )
}
```

##### @Param dispatch:Function 
第一个参数`dispatch`表示`store.dispatch`。  


##### @Param ownProps  
如果`mapDispatchToProps`声明了两个参数，在调用时，会将`store.dispatch`作为第一个参数传递，将组件的`props`作为第二个参数传递，当组件的收到新的`props`时，`mapDispatchToProps`会重新调用。  

##### @return  
`mapDispatchToProps`函数返回一个对象，这个对象的每一个字段都是一个函数，函数的内容就是调用`store.dispatch。`

```javascript
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  }
}
```
返回值会被整合到组件的`props`。就拿上面的例子来说，`props`中有三个字段，`props.increment`，`preps.decrement`，`props.reset`，这样，在组件中就可以直接调用这些字段指向的方法。

```javascript
function Counter({ count, increment, decrement, reset }) {
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}
```

如果定义了`mergeProps`，`mapDispatchToProps`的返回值会作为`mergeProps`的第二个参数。  

#### mergeProps?: (stateProps, dispatchProps, ownProps) => Object

这个参数用来确定最终注入到组件的`props`是怎样的。

##### @Param `stateProps`(`mapStateToProps`的返回值)
##### @Param `dispatchProps`(`mapDispatchToProps`的返回值)，
##### @Param `ownProps`
##### @Returns  

返回值将作为包装组件的`props`。也就是说，默认情况下，返回值为：  
```javascript
{
    ...stateProps,
    ...dispatchProps,
    ...ownProps
}
```

### connect() Return  

connect()最终会返回一个包装函数，用来包装你的组件，然后将包装好的组件返回。

这里的包装就是注入额外的`props`，即，`stateProps`和`dispatchProps`

```javascript
import { login, logout } from './actionCreators'

const mapState = state => state.user
const mapDispatch = { login, logout }

// first call: returns a hoc that you can use to wrap any component
const connectUser = connect(
  mapState,
  mapDispatch
)

// second call: returns the wrapper component with mergedProps
// you may use the hoc to enable different components to get the same behavior
const ConnectedUserLogin = connectUser(Login)
const ConnectedUserProfile = connectUser(Profile)
```


