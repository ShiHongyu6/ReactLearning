[toc]

## 状态提升  

先来思考一个问题：如何让多个子组件共享数据？  

举个[官方文档](https://reactjs.org/docs/lifting-state-up.html)中的例子：有一个温度计算的组件，它包含有两个输入温度的组件，一个表示摄氏度，一个表示华氏度。在其中一个组件输入温度后，将单位转换后的数据显示在另一个组件上。


先来看一下两个子组件的定义：
```javascript
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

//用于温度输入的子组件
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    //用于表示输入的温度
    this.state = {temperature: ''};
  }

  handleChange(e) {
    //因为输入组件的value依赖this.state
    //所以，当有数据输入时，就将state中对应的信息做修改
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

接下来看父组件：
```javascript
class Calculator extends React.Component {
  render() {
    return (
      <div>
        //摄氏度温度输入组件
        <TemperatureInput scale="c" />
        //华氏度温度输入组件
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

现在问题来了，当输入组件输入温度时，它们仅仅修改自己的`state`，导致自己被重新渲染(`render()`方法被调用)，没有办法影响到兄弟组件。  

所以，怎样才能让这两个子组件共享数据呢？  

### 状态提升需要解决的问题  

这里的状态就是`state`，也就是说，让子组件都使用父组件的`state`。怎样使用呢？<font color=#f12>不要忘了可以通过`props`给子组件传递数据</font>  

修改上面的父组件：
```javascript
class Calculator extends React.Component {

  constructor(props) {
      super(props);
      this.state.temperature = "";//初始化state
  }

  render() {
    return (
      <div>
        //摄氏度温度输入组件  通过props将state中的数据传给子组件
        <TemperatureInput scale="c" temperature={this.state.temperature}/>
        //华氏度温度输入组件
        <TemperatureInput scale="f" temperature={this.state.temperature}/>
      </div>
    );
  }
}
```
修改子组件，首先温度获取时不再时通过自己的`state`，而是通过`props`接收父组件传来的值。

```javascript
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};
class TemperatureInput extends React.Component {

    render() {
        const temperature = this.props.temperature;//注意这里与一开始的区别  现在使用props接收父组件传来的值
        const scale = this.props.scale;
        return (
            <fieldset>
            <legend>Enter temperature in {scaleNames[scale]}:</legend>
            <input value={temperature}
                    onChange={this.handleChange} />
            </fieldset>
        );
    }

    //????怎么实现    
    handleChange(e) {
        //这里怎修改父组件的state
    }
}

```
<font color=#f12>问题来了：子组件怎么修改父组件的`state`？</font>如果子组件可以父组件的`state`修改之后，父组件会重新调用`render()`方法，从而子组件的`props`会被修改，子组件也重新`render()`。  

所以，现在最大的问题就是子组件如何修改父组件的`state`。    

### 解决问题的方法 

#### 1. 解决方式一：将父组件引用传到子组件
其实很简单，将父组件的引用通过`props`传下来，然后调用`setState`就可以了。 
*关于温度的转换先不着急实现，现在主要讨论的问题是共享数据的问题*


```javascript
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {temperature : ""}; //初始化state
  }
  
  render() {
    return (
      <div>
        //将父组件的引用通过props传递给子组件  将需要共享的信息传递给子组件
        <TemperatureInput scale="c" parentCom={this} temperature={this.state.temperature}/>
        <TemperatureInput scale="f" parentCom={this} temperature={this.state.temperature}/>
      </div>
    );
  }
}


const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};


class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    //当输入的内容修改时，通过setState修改父组件的state
    //导致父组件重新render 进而导致子组件重新render
    this.props.parentCom.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.props.temperature;     //共享的数据通过父组件传下来
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

```

#### 2. 解决方式二：将修改父组件的函数传到子组件进行回调  
其实上面的解决方式并不是官方文档给出的方式，现在来看一下官方文档给出的方法：  

1. 父组件给子组件传递的并不是自身的引用，而是一个回调函数，当子组件输入数据时，触发这个回调函数。
2. 这个回调函数通过`bind()`方法绑定父组件自身，在回调函数中调用`this.setState`就可以修改父组件`state`

```javascript
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};
//华氏度转摄氏度（这不是重点）
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}
//摄氏度转华氏度（这不是重点）
function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
//温度转换（这不是重点）
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {//判断输入的温度是否合法
    return '';
  }
  const output = convert(input);//通过convert回调进行温度转换
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);//事件触发时 this指向组件本身
  }

  handleChange(e) {
    //事件处理时 调用父组件传下来的回调函数
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;//从父组件的state获取 而不是自己的state
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);//子组件进行回调时 this的值仍然为父组件本身
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  //这个函数在子组件调用  作用就是用来修改父组件的state
  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
      </div>
    );
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
```

### 总结  

关于状态提升的要点其实很简单：
1. 子组件事件触发时，修改父组件的`state`
2. 子组件的数据，来源于父组件的`state`，通过`props`传递
3. 一旦父组件的`state`改变，父组件重新`render`，子组件随之重新`render`  

附一张简陋的图片：   
[原理图.png](./原理图.png)