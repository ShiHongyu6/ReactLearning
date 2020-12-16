# 条件渲染  

## 1. 在不同分支中渲染不同的组件

### 1.1 在不同分支中使用不同的组件

有下面两个组件，分别表示了用户模式和游客模式的不同组件，它们的父组件需要判断当前是游客还是用户，然后用他们其中之一进行渲染。
```javascript
function UserGreeting(props) {
    return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
    return <h1>Please sign up.</h1>;
}
```

可以通过将两个组件分别放在两个分支中，以实现条件渲染。
```javascript
function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;

    //不同的组件应用到不同的分支中
    if (isLoggedIn) {
    return <UserGreeting />; 
    }
    return <GuestGreeting />;
}
```

### 1.2 在不同分支中将组件赋值给同一个变量  

```javascript
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```


```javascript
class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        //这里是为了事件触发时，可以通过this访问到出发事件的组件的实例(React元素)
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        //初始化state
        this.state = {isLoggedIn: false};
    }

    //事件处理方法
    handleLoginClick() {
        //通过setState修改state 进而触发render()方法
        this.setState({isLoggedIn: true});
    }
    handleLogoutClick() {
        this.setState({isLoggedIn: false});
    }


    render() {
        const isLoggedIn = this.state.isLoggedIn;
        //在不同分支中将不同的组件分别赋值给button变量
        let button;
        if (isLoggedIn) {
            button = <LogoutButton onClick={this.handleLogoutClick} />;
        } else {
            button = <LoginButton onClick={this.handleLoginClick} />;
        }

        //通过`{}`使用上面复赋值好的组件
        return (
            <div>
            <Greeting isLoggedIn={isLoggedIn} />
            {button}
            </div>
        );
    }
}
```

可以这样使用的原因是`JSX`被编译为`React.createElement()`方法的调用，因此`JSX`本质上就是一个React元素，即一个JS对象，因此，它可以被赋值给一个变量，同时也可以使用`{var}`来使用这个对象。    


### 1.3 与运算符  
```javascript
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}
```
条件运算符的短路运算，实现了分支的功能。通过`{}`包含表达式，就可以得到这个表达式的值，如果`A && B`中，`A`的值为`true`，则这个表达式的值为`B`。


### 1.4 三目运算符  
```javascript
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

## 2. 阻止渲染  

对于函数组件来说，如果函数组件返回`null`，则不会渲染这个组件；  
对于`class`组件来说，如果`render()`方法返回`null`，则不会渲染这个组件。  

```javascript

//警告组件
function WarningBanner(props) {
    //通过props来判断是否渲染这个组件
    if (!props.warn) {//如果warn属性为false则不渲染
        return null;
    }

    return (
    <div className="warning">
        Warning!
    </div>
    );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

<font color=#f12>是否阻止组件渲染（函数组件返回`null`/`render()`返回`null`），**不会影响组件的生命周期**</font>。例如，`componentDidUpdate()`仍然会执行。  

