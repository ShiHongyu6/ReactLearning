## JSX
一种扩展了的JS语法。看起来就像是将一个`Tag`赋值给一个变量。

```javascript
const element = <h1>Hello, world!</h1>;
```
JSX最终会被编译成合法的JS语句。JSX声明的看起来向标签的内容被称作<font color=#f12>React元素(React Element)</font>


### JSX本质:JSX是一个表达式

JSX最终会被编译成JS表达式，所以JSX可以出现在JS表达式出现的地方。

```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

上面者段代码会被编译成如下代码：  
```javascript
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

其实就是创建了一个React元素（简化版本）：

```javascript
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

使用`React.createElement()`会预先执行检查，帮助写出无错的代码。


### 使用表达式
可以使用`{expression}`的方式在JSX中使用表达式。  

```javascript
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);

```
建议将JSX拆分成多行。

```javascript
const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

```

### JSX指定属性

#### 使用字面量  
```javascript
const element = <div tabIndex="0"></div>;
```
#### 使用变量

```javascript
const element = <img src={user.avatarUrl}></img>;
```

#### JSX属性与HTML标签属性的不同
JSX除了指定标签之外，还可以指定标签的属性。在指定标签属性的时候，和HTML中的标签有一些差别。<font color='#f12'>JSX属性名使用JS中`Element`的属性名。</font>例如，JS要访问`class`属性，使用`element.className`，在JSX中，指定`class`属性时，需要使用`className`而不是`class`。


### JSX防止注入攻击  
所有内容在渲染前都会被转换成字符串，防止XSS（cross-site-scripting, 跨站脚本）攻击。
