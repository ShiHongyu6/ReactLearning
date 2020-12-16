## 作为容器的组件  

在之前举得例子中，一个组件如果有子组件，那么这个子组件也是确定的。但是，这样就忽略了一种情况，当一个组件仅作为容器，但是它包含的子组件并不能在定义时就确定，这要怎么解决。  

### props.children  
如果一个组件存在子组件，那么这些子组件就会保存在`props.children`中。  

作为容器的组件：  
```javascript
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children} //子组件存储在props.children中
    </div>
  );
}

```

使用上面的容器组件：  
```javascript
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
    /*** 容器中的子组件 ***/
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

为了看的更清楚，可以看一下它们被`Babel`编译后的代码：  

```javascript
function FancyBorder(props) {
  return (
    React.createElement("div", { className: 'FancyBorder FancyBorder-' + props.color },
    props.children));
}

function WelcomeDialog() {
    return (
        React.createElement(FancyBorder, { color: "blue" },
            React.createElement("h1", { className: "Dialog-title" }, "Welcome"),
            React.createElement("p", { className: "Dialog-message" }, "Thank you for visiting our spacecraft!")
        )
    );
}
```
可以看到，`JSX`就是一个`ReactElement`，现在继续看一下`React.createElement()`的部分源码，帮助理解`props.children` : 

```javascript

//这部分源码已经经过删减，只保留理解props.children内容的的部分

    //对比上面的代码  可以知道type就是一个字符串（DOM对象）或者一个函数/类（组件）
    //config是一个对象，用来保存在组件上指定的属性
    //children则是它的子组件
function createElement(type, config, children) {
  //清楚了上面三个参数，接下来看它的封装过程
  let propName;

  const props = {};

  let key = null;

  if (config != null) {
      /**
       * 这里删减了部分代码，跟我们要讨论的事无关 
       */

    //遍历config  也就是遍历JSX设置的属性
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        //将JSX设置的属性保存到props属性中
        props[propName] = config[propName];
      }
    }
  }

  //前两个参数是type和config  所以，子组件的个数是arguments.length - 2
  const childrenLength = arguments.length - 2;
  //下面 从参数中取出所有的子组件 并把它们保存到props.children中
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    
    props.children = childArray;
  }

    /**
     * 这里也删减了部分不必要的代码
     */

  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props, //一个ReactElement的props  包含了JSX设置的属性与它所有的子组件
  );
}
```

一个容器组件之所以可以使用`{props.children}`来获取子组件，并不关心子组件是什么，就是因为子组件已经被封装到了容器组件的`props.children`中。

### 通过props传入子组件  
除了`React`提供的`props.children`访问组件的子组件外，还可以将子组件作为属性传到容器组件中。  


```javascript
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={ //通过属性传入ReactElement
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```  

### 特例关系：使用组合而不是继承  
按照一般的思路，处理这种一般情况与一般情况中的特殊情况，例如：Person和Student，一般会使用继承的方式。但是React官方强烈不建议使用继承来实现这种特例，而是使用组合的方式。  

```javascript
//一般
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

//一般情况的特殊情况
function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}

```