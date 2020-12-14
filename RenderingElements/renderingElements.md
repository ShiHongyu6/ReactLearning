# 元素渲染  

## React元素和Dom元素的关系  
React元素时开销极小的普通元素，<font color=#f12>描述了</font>要在屏幕显示的内容；浏览器使用Dom元素(HTMLElement)来渲染页面。  

React只是描述了要显示什么，浏览器最终显示的东西是需要根据Dom来进行渲染。  

React Dom负责将React同步到Dom元素。（初次渲染到页面时，根据React元素创建Dom元素）

## ReactDOM.render()

使用`ReactDOM.render()`将React元素渲染到页面上，这个函数的作用就是将一个`ReactElement`渲染到页面中。  
```javascript
ReactDOM.render(ReactElement, HTMLElement)
/**
 *@ReactElement 需要被渲染的react元素 (通过JSX或React.createElement创建)
 *@HTMLElement react元素渲插入的位置
 */
```


### 举例  

页面中，有一个id为root的元素。
```HTML
<div id="root"></div>
```

```javascript
const element = <h1>Hello, world</h1>;//创建一个react元素
ReactDOM.render(element, document.getElementById('root'));//将这个react元素渲染为页面中id为root的节点的子节点
```

## 更新已渲染的元素
React元素是一个不可变对象，想要对React元素对应的Dom元素进行修改，<font color=#f12>唯一的做法</font>是使用`ReactDOM.render()`传入新的react元素重新渲染。  

### 举例    

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}
setInterval(tick, 1000);
```

虽然例子的意思是没1000ms都会将一个“新的”React元素渲染到页面中，其实React DOM仅更新<font color=#f12>变化了的部分</font>，而不是根据React元素重新创建一个全新的DOM元素。
