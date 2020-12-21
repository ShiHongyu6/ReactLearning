[toc]
## 组件不应该关心`payload`的结构  

举个例子，在一个组件中，当某个事件触发时，调用`dispatch()`；需要传入一个`action`；这个`action`由`createSlice()`创建的`action creator`创建。  

```javascript
const dispatch = useDispatch();
dispatch(addPost({id:postId, title, content}));
```

在这个例子中，因为这个`action`需要指定`payload`参数，因此需要知道`payload`里面又什么数据，例如，这里就需要知道“它有三个属性，分别为`id`, `title`, `content`”。  

但是，组件**不应该**关心`payload`“长什么样”，仅需要传递这个`payload`需要的参数即可，例如：`dispatch(addPost(postId, title, content))`。这里看起来和上面没什么区别，但是这里完全不用管`payload`到底有什么属性，组件只需要知道这个事件需要这三个参数即可。  

为了完成上面说的，就需要手写一个`action creator`，`createSlice`创建的`action creator`仅接收一个参数，就是`payload`，而手写的`action creator`使用传入的参数创建一个`action`。  

例如： 
```javascript

/**
 * createSlice生成的creator
 */
addPost(payload) {
    return ({
        type : "post/addPost",
        payload
    });
}

/**
 * 手写的creator
 */
addPost(title, content) {
    return ({
        type : "post/addPost",
        payload : {
            id : nanoid(),
            title,
            content
        }
    });
}
```
注意，对于一个`add`（添加）的逻辑，组件获取一个组件的`id`不应该由组件处理，在手写的`creator`中处理更加合适。  

`createSlice()`提供了自定义`payload`的方法：`prepare callback`


### prepare callback

在调用`createSlice()`时，可以传入回调函数对`payload`进行定制。  

```javascript
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content) {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        }
      }
    }
    // other reducers here
  }
})
```

现在，`createSlice()`自动生成的`action creator`被调用时，`payload`为`prepare`函数的返回值的一个**属性**。