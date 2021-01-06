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