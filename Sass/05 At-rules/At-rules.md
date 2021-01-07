[toc]
### @use
`@use`用来加载其他Sass样式表（模块）中的`mixin`,`function`,`variable`  

```sass
// foundation/_code.scss
code {
  padding: .25em;
  line-height: 0;
}
// foundation/_lists.scss
ul, ol {
  text-align: left;

  & & {
    padding: {
      bottom: 0;
      left: 0;
    }
  }
}
// style.scss
@use 'foundation/code';
@use 'foundation/lists';
```

```css
code {
  padding: .25em;
  line-height: 0;
}

ul, ol {
  text-align: left;
}
ul ul, ol ol {
  padding-bottom: 0;
  padding-left: 0;
}
```

#### 加载成员  
通过`@use`加载模块后，可以通过`<namespace>.<member>`来访问被加载模块的变量、函数等。  

```sass
// src/_corners.scss
$radius: 3px;

@mixin rounded {
  border-radius: $radius;
}
// style.scss
@use "src/corners";

.button {
  @include corners.rounded;
  padding: 5px + corners.$radius;
}
```

#### 重命名namespace  
可以使用`@use "<url>" as <namespace>`来重命名。  
```sass
// style.scss
@use "src/corners" as c;

.button {
  @include c.rounded;
  padding: 5px + c.$radius;
}
```

如果使用`*`重命名载入的组件，则使用组件成员时，不需要使用命名空间进行限定。  
```sass
// style.scss
@use "src/corners" as *;

.button {
  @include rounded; // 不需要使用<namespace>.rounded的方式引用
  padding: 5px + $radius;
}
```

#### 私有成员  
想声明一个私有成员，只需要让成员以`-`或`_`开头即可。  

```sass
// src/_corners.scss
$-radius: 3px;

@mixin rounded {
  border-radius: $-radius;
}
// style.scss
@use "src/corners";

.button {
  @include corners.rounded;

  // This is an error! $-radius isn't visible outside of `_corners.scss`.
  padding: 5px + corners.$-radius;
}
```

#### partial  
Sass文件如果以`_`开头，表示这是一个组件，并不需要单独转译，其他样式加载组件时，省略组件开头的`_`。  

#### `index`组件  
如果一个文件夹（目录）中有一个`_index.scss`文件，则可以使用`@user <目录名>`来加载目录下的`_index.scss`组件  

```sass
// foundation/_index.scss
@use 'code'
@use 'lists'



// style.scss
@use 'foundation' // 加载fundation下的_index.scss
```

#### 加载CSS
```SASS SYNTAX
// code.css
code {
  padding: .25em;
  line-height: 0;
}


// style.sass
@use 'code'
```

### @forward  

> The @forward rule loads a Sass stylesheet and makes its mixins, functions, and variables available when your stylesheet is loaded with the @use rule. 

如果模块A使用了`@forward`“转发”模块B。当模块A被使用`@use`加载时，模块B也被同时加载。

也就是说，模块A中使用`@forward 'B'`，相当于在A中定义了与B一摸一样的成员（非私有）。

```SCSS SYNTAX
// src/_list.scss
@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}


// bootstrap.scss
@forward "src/list";


// styles.scss
@use "bootstrap"; 
// 'bootstrap'转发了'list'模块
// 这使得'list'中的非私有成员被加载

li {
  @include bootstrap.list-reset;
}
```

#### 转发时添加前缀  
上面也说过了，转发相当于自己定义。再转发的同时，也可以给被转发模块的成员的名称添加前缀。  

`@forward "<url>" as <prefix>-*`  

```SCSS SYNTAX
// src/_list.scss
@mixin reset {
  margin: 0;
  padding: 0;
  list-style: none;
}


// bootstrap.scss
@forward "src/list" as lis-*;
// 转发时添加了前缀'list-'
// 相当于该模块定义了 @mixin list-rest{...}


// styles.scss
@use "bootstrap";
li {
  @include bootstrap.list-reset;
}
```

#### 控制可见性（控制转发）  
如果想要在转发时让某些变量不可见（只想转发某些成员，而不是全部），则可以使用`@forward "<url>" hide <members...>`(转发时不转发某些成员)或
`@forward "<url>" show <members...>`(转发时转发指定的成员)  

```SCSS SYNTAX
@forward "src/list" hide list-reset, $horizontal-list-gap;
//不转发list-rest和$horizontal-list-gap

```

#### 转发的同时配置（修改默认值）
再转发的同时，可以修改被转发模块的默认值，即配置被抓饭的模块  

```SCSS SYNTAX
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}


// _opinionated.scss
@forward 'library' with (
  $black: #222 !default,
  $border-radius: 0.1rem !default
);


// style.scss
@use 'opinionated' with ($black: #333);

```

### @mixin、@include、@content  

#### @mixin定义一个可复用的样式，通过@include使用  

```SCSS SYNTAX
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

@mixin horizontal-list {
  @include reset-list;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: 2em;
    }
  }
}

nav ul {
  @include horizontal-list;
}
```
转译后 

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav ul li {
  display: inline-block;
  margin-left: -2px;
  margin-right: 2em;
}
```

#### 参数  
使用`@mixin`定义可复用的样式时，可以指定参数；在使用`@include`时，需要传入参数。  

```SCSS SYNTAX
@mixin rtl($property, $ltr-value, $rtl-value) {
  #{$property}: $ltr-value;

  [dir=rtl] & {
    #{$property}: $rtl-value;
  }
}

.sidebar {
  @include rtl(float, left, right);
}
```

转译后

```css
.sidebar {
  float: left;
}
[dir=rtl] .sidebar {
  float: right;
}
```

在定义时，可以指定参数的默认值，使这个参数变为一个“可选择的”参数。也就是说，使用`@include`时，如果不传递有默认值的参数，就会使用默认值。

```SCSS SYNTAX
@mixin replace-text($image, $x: 50%, $y: 50%) {
  text-indent: -99999em;
  overflow: hidden;
  text-align: left;

  background: {
    image: $image;
    repeat: no-repeat;
    position: $x $y;
  }
}

.mail-icon {
  // 只传了$image和$x  $y使用默认值50%
  @include replace-text(url("/images/mail.svg"), 0);
}
```

在传递参数时，也可以指出参数的参数名，这对于存在多个可选参数的情况很有用；同时，也可以让参数有“语义”，而不是仅仅传一个值，这个值代表什么还需要去看`@mixin`的定义。  

```SCSS SYNTAX
@mixin square($size, $radius: 0) {
  width: $size;
  height: $size;

  @if $radius != 0 {
    border-radius: $radius;
  }
}

.avatar {
  @include square(100px, $radius: 4px);
}
```

可变参数列表。  

```scss 
@mixin order($height, $selectors...) {
  @for $i from 0 to length($selectors) {
    #{nth($selectors, $i + 1)} {
      position: absolute;
      height: $height;
      margin-top: $i * $height;
    }
  }
}

@include order(150px, "input.name", "input.address", "input.zip");
```

传递任意的关键字参数。  
```scss
@use "sass:meta";

@mixin syntax-colors($args...) {
  @debug meta.keywords($args);
  // (string: #080, comment: #800, variable: #60b)

  @each $name, $color in meta.keywords($args) {
    pre span.stx-#{$name} {
      color: $color;
    }
  }
}

@include syntax-colors(
  $string: #080,
  $comment: #800,
  $variable: #60b,
)
```

使用`meta.keywords()`函数，可以将参数列表转换为`map`。  

#### @content  

在使用`@mixin`定义时，可以指定`@content`；`@include`使用这个mixin时，可以传入一个样式块，这个样式块替换`@content`。  

```scss
@mixin hover {
  &:not([disabled]):hover {
    @content;
  }
}

.button {
  border: 1px solid black;
  @include hover { // 使用样式块替换hover中@content
    border-width: 2px;
  }
}
```

转译后  

```css
.button {
  border : 1px solid black;
}
.button:not([disabled]):hover {
  border-width: 2px;
}
```

除了给mixin本身传递参数外，还可以给内容块传递参数。 
`@content(<arguments...>)`用来传递参数，`@include <name> use (<arguments...>)`接收指定mixin的内容块传递的参数。 

```scss
@mixin media($types...) {
  @each $type in $types {
    @media #{$type} {
      @content($type); // 将$type传递内容块的参数
    }
  }
}

@include media(screen, print) using ($type) {
  h1 {
    font-size: 40px;
    @if $type == print {
      font-family: Calluna;
    }
  }
}
```

转译后  

```css
@media screen {
  h1 {
    font-size: 40px;
  }
}
@media print {
  h1 {
    font-size: 40px;
    font family: Calluna;
  }
}

```

### @function  
使用`@function`定义Sass函数。  

```scss
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  float: left;
  margin-left: pow(4, 3) * 1px;
}
```

### @extend  
