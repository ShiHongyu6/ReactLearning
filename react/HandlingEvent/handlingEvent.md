## 函数组件
```javascript
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();  //阻止默认行为
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}

```

注意，`handleClick`中的`e`是一个合成事件，是对原生事件的封装。

## class组件
```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);

```

## 指定回调函数的调用上下文
为了在回调函数中可以拿到`state`，`props`及对象本身的其他属性，就需要指定回调函数的调用上下文。


```javascript
class LoggingButton extends React.Component {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log('this is:', this);
  } //这里声明的不是原型函数，每一个LoggingButton的实例都会有一个handleClick属性，并且这里使用了箭头函数，所以这个函数的this参数已经绑定到自己所在的实例

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}

```



```javascript
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

## 给回调函数传参  
```javascript
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button> //通过bind()方法
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button> //通过闭包
```