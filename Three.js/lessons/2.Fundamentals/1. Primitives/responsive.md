[toc]

## 随记

### EdgesGeometry

```js
const radius = 7;
const widthSegments = 6;
const heightSegments = 3;
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const thresholdAngle = 1;  

const geometry = new THREE.EdgesGeometry(sphereGeometry, thresholdAngle);
```



当两个面的夹角大于阈值，才会显示两个面相交的边。



### THREE.DoubleSide

```js
const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
});
```

对于每一个三角形，三角形的两个面都显示。

- 对于封闭的立体图形，“里”面是看不到的。
- 对于2d图形，例如PlanGeometry和ShapeGeometry来说，两面都可以看到，如果不设置`side:THREE.DoubleSide`，就只能看到一面。

