import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { World } from "./classes/world.js";



//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);



//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(20, 35, 55);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true; // Effet d’inertie
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.6;
controls.maxDistance = 70;
controls.maxPolarAngle = Math.PI / 2.1;
controls.update();



//scene
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const nightSkyTexture = textureLoader.load("./assets/textures/sky_night.jpg");
const skyGeo = new THREE.SphereGeometry(500, 16, 16);
const skyMat = new THREE.MeshBasicMaterial({ map: nightSkyTexture, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

const world = new World(12345, camera, scene);
world.generate(camera);
scene.add(world);

function setUpLights(){
    const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
    light1.position.set(5, 10, 5);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 1024;
    light1.shadow.mapSize.height = 1024;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 50;
    light1.shadow.camera.left = -30;
    light1.shadow.camera.right = 30;
    light1.shadow.camera.top = 30;
    light1.shadow.camera.bottom = -30;
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
    light2.position.set(-5, 10, -5);
    scene.add(light2);

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.1;
    scene.add(ambient);
}



//renderer loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



setUpLights();
animate();