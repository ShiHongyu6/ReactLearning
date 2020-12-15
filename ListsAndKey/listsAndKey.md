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

## 这里的List不仅仅是`<li>`  
