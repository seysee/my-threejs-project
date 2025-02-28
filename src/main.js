import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { World } from "./classes/world.js";



//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x333333);
renderer.shadowMap.enabled = true; //ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);



//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(-50, 50, 70);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();



//scene
const scene = new THREE.Scene();
const world = new World(12345);
world.generate(camera);
scene.add(world);

function setUpLights(){
    const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
    light1.position.set(5,10,5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
    light2.position.set(-5, 10, -5);
    scene.add(light2);

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.1;
    scene.add(ambient);
}



//renderer loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



setUpLights();
animate();