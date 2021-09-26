import * as THREE from 'https://cdn.skypack.dev/three';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js';
window.onload = loadFile.bind(null, './LittlestTokyo_.glb');

function main(obj) {
    const scene = new THREE.Scene().add(obj.scene);
    // const scene = obj.scene.clone();
    console.log(scene);
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0x222222);
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);

    {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        const light = new THREE.AmbientLight( 0xffffff ); 
        const boxHelper = new THREE.BoxHelper(scene);
        const center = boxHelper.geometry.boundingSphere.center;
        const radius = boxHelper.geometry.boundingSphere.radius;
        const position = new THREE.Vector3(center.x+radius*5, center.y+radius*5, center.z+radius*5);
        directionalLight.position.copy(position);
        scene.add(directionalLight);
        scene.add(light);

    }
    camera.position.set(100, 300, 400);
    camera.lookAt(0, 0, 0);

    
    const clock = new THREE.Clock();
    const animations = obj.animations;
    const mixer = new THREE.AnimationMixer(obj.scene);
    animations.forEach(clip => {
        const action = mixer.clipAction(clip);
        action.play();
        action.setLoop(THREE.LoopOnce);
    })

    function resizeCanvas() {   
        if(canvas.clientWidth !== canvas.width 
            || canvas.clientHeight !== canvas.height) {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            return true;
        }

        return false;
    }
    

    function animation(time) {
        if(resizeCanvas()) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        mixer.update(clock.getDelta());
        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);

    console.log(mixer);
    // mixer.stopAllAction();
    // mixer.uncacheRoot(obj.scene);
    // console.log(mixer);
    // mixer.uncacheActrion();
    // console.log(mixer);
}

function loadFile(url) {
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('./js/');
    const loader = new GLTFLoader();
    // loader.setDRACOLoader(dracoLoader)
    loader.load(url, obj => {
        console.log(obj);
        main(obj);
    })
}

class SerialSegment {
    
}