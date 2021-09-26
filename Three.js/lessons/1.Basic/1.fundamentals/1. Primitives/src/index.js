window.onload = main;

function main() {


    const canvas = document.querySelector('#main');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
    camera.position.z = 2;
    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // 不受光源影响的material
    // const material = new THREE.MeshBasicMaterial({color : 0x44aa88});    

    // 寿光元影响的material
    const material = new THREE.MeshPhongMaterial({ color : 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xfffff, 1);

    // 光源默认的位置0,0,0， 修改光源位置；目标位置默认为0,0,0
    // light.position.x = -1;
    // light.position.y = 2;
    // light.position.z = 4;
    light.position.set(-1, 2, 4);
    scene.add(light);


    renderer.render(scene, camera);

    function animation(time) {

        time *= 0.001;
        cube.rotation.x = time;
        cube.rotation.y = time;

        renderer.render(scene, camera);
    
        requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}
