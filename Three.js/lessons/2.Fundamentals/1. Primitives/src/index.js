window.onload = main;

function main() {


    const canvas = document.querySelector('#main');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
    camera.position.z = 40;
    const scene = new THREE.Scene();

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // 不受光源影响的material
    // const material = new THREE.MeshBasicMaterial({color : 0x44aa88});    

    // 寿光元影响的material
    // const material = new THREE.MeshPhongMaterial({ color : 0x44aa88 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // const light = new THREE.DirectionalLight(0xfffff, 1);

    // 光源默认的位置0,0,0， 修改光源位置；目标位置默认为0,0,0
    // light.position.x = -1;
    // light.position.y = 2;
    // light.position.z = 4;
    // light.position.set(-1, 2, 4);
    // scene.add(light);
    const objects = [];

    createTextMesh(scene, objects);


    // renderer.render(scene, camera);

    function animation(time) {


        time *= 0.001;
        objects.forEach(obj => {
            obj.rotation.x = time;
            obj.rotation.y = time;
        })

        
        if(canvas.clientWidth !== canvas.width || canvas.clientHeight !== canvas.height) {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}


function loadFont(url) {
    const loader = new THREE.FontLoader();
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    })
}

async function createTextMesh(scene, objects) {
    const font = await loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');   
    const geometry = new THREE.TextGeometry('three.js', {
      font: font,
      size: 3.0,
      height: .2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: .3,
      bevelSegments: 5,
    });

    const mesh = new THREE.Mesh(geometry, createMaterial());
    scene.add(mesh);
    // objects.push(mesh);
    
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const boundingBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), createMaterial());
    scene.add(boundingBoxMesh);
    // objects.push(boundingBoxMesh);

    console.log(boundingBox)
    boundingBox.getCenter(mesh.position);
    console.log(mesh.position);
    // const container = new THREE.Object3D();
    // container.add(mesh);
    // scene.add(container);
    // objects.push(container);
}

function createMaterial() {
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }