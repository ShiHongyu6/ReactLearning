[toc]
### 变量名等效对待`-`和`_`  
`$font-size`和`$font_size`指向同一个变量。  

### 配置模块`!default`
如果一个模块被引用时，希望可以给模块中的某些值赋值，则需要使用`!default`。

`!default`是为了使用`@use`时，可以配置引用的模块。

例如:  
```CSS
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
// style.scss
@use 'library' with (
  $black: #222,
  $border-radius: 0.1rem
);
```
转译后
```css
code {
  border-radius: 0.1rem;
  box-shadow: 0 0.5rem 1rem rgba(34, 34, 34, 0.15);
}
```

可以被配置的变量后面需要加`!default`， 并且**需要放在模块的开头**

### 内置变量  
内置变量是内置组件定义的变量，不可以修改。
```css
@use "sass:math" as math;

// This assignment will fail.
math.$pi: 0;
```


### Scope（作用域）
与其它语言一样，也存在“块级作用域”和“全局作用域”。  

```css
$global-variable: global value;

.content {
  $local-variable: local value;
  global: $global-variable;
  local: $local-variable;
}

.sidebar {
  global: $global-variable;

  // This would fail, because $local-variable isn't in scope:
  // local: $local-variable;
}
```

同样，如果一个代码块中存在与全局变量名字相同的变量，则在该代码块中，这个名字引用代码块内的变量，而不是全局变量。

```css
$variable: global value;

.content {
  $variable: local value;
  value: $variable;//local value
}
```

可以看到，Sass中声明一个变量不需要使用关键字，这样就会出现问题，就拿上面的例子来说，其实是声明了一个局部的`$variable`，并赋值为`local value`，但是，如果本来是想通过赋值修改全局的`$variable`而不是声明一个局部变量，就需要使用`!global`指明。  

```css
$variable: first global value;

.content {
  $variable: second global value !global;
  value: $variable;
}
```

`!global`仅能在代码块内部修改**已声明**的全局变量，而不能声明新的全局变量。

#### 流控制中修改全局变量 不需要!global  
```css
$dark-theme: true !default;
$primary-color: #f8bbd0 !default;
$accent-color: #6a1b9a !default;

@if $dark-theme {
  // 因为是在@if中，所以这里即使不使用!global 也是给全局变量赋值 而不是创局部变量
  $primary-color: darken($primary-color, 60%); 
  $accent-color: lighten($accent-color, 60%);
}
```