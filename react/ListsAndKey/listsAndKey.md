## 列表和Key  

在展开这部分内容之前，先来看一个列子。  

```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((numbers) =>
  <li>{numbers}</li>
);

ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```
看起来没有什么问题，但是，却会报错：<font color=#F12>`Warning: Each child in a list should have a unique "key" prop.`</font>  

错误信息提示列表中的每一个元素都需要一个<font color=#f12>唯一的</font>属性`key`;  

为什么需要这个属性呢？看一段[React官方文档](https://reactjs.org/docs/lists-and-keys.html)的原文
> Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity  

也就是说，这个`key`是用来判断这个列表中的每一个元素是否发生了改变。   

## 这里的列表（List）指的不是`<ul/>`或`<ol/>`     
先看下面两个例子，比较他们的不同：  
```javascript
const reactElement = (
   <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
  </ul>);

ReactDOM.render(
  reactElement,
  document.getElementById('root')
);
```
这个例子已经非常熟悉了，就是创建了一个React元素，然后进行渲染。


```javascript
const reactElementList = [
      <div>1</div>,
      <div>2</div>,
      <div>3</div>,
      <div>4</div>,
      <div>5</div>
  ];

ReactDOM.render(
  reactElementList,
  document.getElementById('root')
);

```
这个例子乍一看没什么，仔细一看又觉得很怪，因为这里用的是一个数组，存了多个`React`元素。   

果然，熟悉的报错又来了 : <font color=#f12>`Warning: Each child in a list should have a unique "key" prop.`</font>   

可以看到，这里说的`List`其实就是`React`元素组成的数组。如果在使用`React`的过程中，需要使用到这样的数组，就需要给数组的每一个元素都指定一个唯一的`key`。

上面直接写一个数组的原因是为了直观，在实际使用中更多的情况可能是调用`map()`方法得到一个`List`:  

```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number}>{number}</li> //在这里  指定了key
);

ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```