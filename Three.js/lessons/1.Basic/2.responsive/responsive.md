# Responsive Designd

[toc]

对[Fundamentals](../1.fundamentals/Three.js Fundamentals.md)中的代码进行一些修改，由于原来的代码`canvas`使用默认的大小(300x150)，想要实现响应式的布局，因此设置一些样式。

```html
<style>
    body {
        width: 100vw;
        height : 100vh;
        margin: 0;
    }

    #main {
        width: 100%;
        height : 100%;
    }
</style>
```

## 出现问题

- 问题1：图形拉伸变形
- 问题2：边缘不平滑

![](E:\notes\Three.js\lessons\1.Basic\2.responsive\stretched.PNG)

## 问题解决

### 1. 拉伸变形（相机的宽高比与窗口的宽高比不一致）

正如标题所说，应该设置相机的宽高比为clientWidth/clinetHeight。

```js
    function animation(time) {

        time *= 0.001;
        cube.rotation.x = time;
        cube.rotation.y = time;

        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        
        renderer.render(scene, camera);
    
        requestAnimationFrame(animation);
    }
```

相机的属性：

- aspect
- far
- filmGauge
- filmOffset
- focus
- fov
- near
- view
- zoom

**当修改上述这些属性后，需要调用`camera.updateProjectionMatrix()`。**

### 2. 边缘不平滑

`canvas`元素有两个`size`，一个展示的`size`（CSS设置的）；另一个`size`时`canvas`本身的`size`（逻辑像素）。就像一个图片本身的`size`是128x64（逻辑像素），但是如果用CSS设置展示的`size`为400x200，图片就会不清晰。

这里，就是因为`canvas`在页面展示的`size`大于本身的`size`，因此，需要将它本身的`size`设置为和展示的`size`一样。`canvas`本身的(内部的，internal)`size`，它的分辨率（`resolutions`），也被叫做`drawingbuffer size`。可以通过`renderer.setSize()`设置。



```js
// clientWidth clientHeight 表示canvas显示尺寸
// width height 表示canvas尺寸（内部尺寸或drawingbuffer size）
// 设置时 不可以使用canvas.width = canvas.clientWidth，需要使用renderer.setSize()


if(canvas.clientWidth !== canvas.width 
   || canvas.clientHeight !== canvas.height) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}
```

<font color=#f12>注意上面的代码，renderer.setSize()最后一个参数传递了**false**，则个参数的作用是是否同时设置clientSize，默认为true，因为clientSzie再CSS中设置的都是100%，当页面大小改变时，renderer.setSize()触发一次后，clientSize就会变成一个定值，就没办法响应式布局了</font>





在问题1的解决中，不停的更新`camera.aspect`，然后不同的更新矩阵，在没有调整大小时，就会有性能浪费，因此，可以与问题二的解决的代码放到一起。

```js
if(canvas.clientWidth !== canvas.width 
   || canvas.clientHeight !== canvas.height) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
}
```

## Handing HD-DPI

对于高分辨率设备，一个逻辑像素显示为多个物理像素。

拿像素比为3的设备举例，GPU进行一次计算后，对于计算后的每个逻辑像素，在设备上浏览器会渲染为9个像素。如果想要浏览器渲染的时，9个像素都由GPU计算，就是我们上面说的，`canvas`的内部`size`就需要乘3，`clientSize不变`。

这样，每一个像素都会由GPU计算得到，图形会更加细腻。

```js
const canvas = renderer.domElement;
const pixelRatio = window.devicePixelRatio;
const width  = canvas.clientWidth  * pixelRatio | 0;
const height = canvas.clientHeight * pixelRatio | 0;
const needResize = canvas.width !== width || canvas.height !== height;
if (needResize) {
    renderer.setSize(width, height, false);
}
```

```js
/**three.js/src/renderers/WebGLRenderer.js*/
this.setPixelRatio = function ( value ) {

    if ( value === undefined ) return;

    _pixelRatio = value;

    this.setSize( _width, _height, false );

};
```

```js
/**three.js/src/renderers/WebGLRenderer.js*/
this.setSize = function ( width, height, updateStyle ) {

    if ( xr.isPresenting ) {

        console.warn( 'THREE.WebGLRenderer: Can\'t change size while VR device is presenting.' );
        return;

    }

    _width = width;
    _height = height;

    _canvas.width = Math.floor( width * _pixelRatio );
    _canvas.height = Math.floor( height * _pixelRatio );

    if ( updateStyle !== false ) {

        _canvas.style.width = width + 'px';
        _canvas.style.height = height + 'px';

    }

    this.setViewport( 0, 0, width, height );

};
```

