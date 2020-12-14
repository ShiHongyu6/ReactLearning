## 函数组件与class组件  

函数组件与class组件在React中是等效的。

### 函数组件
```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

### class组件  
```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 渲染组件  
```javascript

/** 
 * 声明一个组件
 */
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

通过这个例子可以看到，组件其实本质上还是一个React元素。  


上面的JSX直接使用了定义好的组件，并且指定了一个属性`name`，这个属性可以使用`props.name`在组件中获取到。  


这里看起来像使用JSX创建Welcome元素，其实这里调用了Welcome函数，这个函数返回一个JSX表示的React对象（这个例子中，这个对象比较简单），这个React对象需要使用读取`name`属性来创建这个对象。



## 只读的Props  
React组件（函数、或类中的render()方法）不能修改Props。