import * as THREE from "three";
import { Grid } from "./grid.js";
import { Ground } from "./ground.js";
import { Building } from "./building.js";
import { Skyscraper } from "./skyscraper.js";
import { BuildingModel } from "./BuildingModel.js";
import { BuildingEntrance } from "./BuildingEntrance.js";
import { Collectible } from "./hiddenobject.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class World extends THREE.Group {
    constructor(seed, camera, scene) {
        super();
        this.seed = seed;
        this.camera = camera;
        this.scene = scene;
        this.collectibles = [];
        this.objectsCollected = 0;
        this.timeLeft = 60;
        this.timerInterval = null;
        this.isMissionOver = false;

        this.grid = new Grid(3, 3, 20);
        const ground = new Ground(this.grid.rows * this.grid.cellSize);
        this.add(ground.mesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.cloudTexture = new THREE.TextureLoader().load("./assets/textures/cloud.png");

        this.modelCache = new Map();

        this.generate().then(() => {
            console.log("La génération du monde est terminée.");
            this.spawnCollectibles();
            this.startTimer();
            this.bindRestartButton();
        }).catch((error) => {
            console.error("Erreur lors de la génération du monde :", error);
        });

        this.createClouds();
        this.loadWeapon();
        this.add(this.grid.group);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener("keydown", (event) => {
            if (event.key === "a") this.shootWeapon();
        });

        this.checkTargetLoop();
        this.createCrosshair();
    }

    async generate() {
        const layout = [
            ["customBuilding", "skyscraper", "customBuilding"],
            ["building", "building", "skyscraper"],
            ["customBuilding", "scifiEntrance", "customBuilding"],
        ];

        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.columns; col++) {
                const position = new THREE.Vector3(
                    (col - (this.grid.columns - 1) / 2) * this.grid.cellSize,
                    0,
                    (row - (this.grid.rows - 1) / 2) * this.grid.cellSize
                );

                const type = layout[row][col];

                if (type === "building") {
                    const building = new Building(10, 20, 10, position);
                    this.grid.placeInCell(row, col, building);
                    this.add(building.mesh);
                } else if (type === "skyscraper") {
                    const skyscraper = new Skyscraper(10, 50, 10, position, this.scene, this.camera, this.renderer);
                    this.grid.placeInCell(row, col, skyscraper);
                    this.add(skyscraper.mesh);
                } else if (type === "customBuilding") {
                    await this.loadCachedModel(BuildingModel, './assets/models/sky_t_021_gltf/scene.gltf', position);
                } else if (type === "scifiEntrance") {
                    await this.loadCachedModel(BuildingEntrance, './assets/models/scifi_building_entrance_gltf/scene.gltf', position);
                }
            }
        }
    }

    async loadCachedModel(ModelClass, url, position) {
        if (this.modelCache.has(url)) {
            const model = this.modelCache.get(url).clone();
            model.position.copy(position);
            this.add(model);
            return;
        }

        const modelInstance = new ModelClass(url, position);
        await modelInstance.loadModel().then(() => {
            this.modelCache.set(url, modelInstance.mesh.clone());
            this.add(modelInstance.mesh);
        });
    }

    createClouds() {
        const cloudGroup = new THREE.Group();
        const numClouds = 20;
        const radius1 = this.grid.rows * this.grid.cellSize * 0.95;
        const radius2 = this.grid.rows * this.grid.cellSize * 0.8; // rayon

        const spriteMaterial = new THREE.SpriteMaterial({
            map: this.cloudTexture,
            transparent: true,
            opacity: 0.5,
            color: new THREE.Color(0xffaacc)
        });

        for (let j = 0; j < 2; j++) {
            const radius = j === 0 ? radius1 : radius2;
            const heightOffset = j === 0 ? 15 : 2; // hauteur de chaque rangée de nuages
            for (let i = 0; i < numClouds; i++) {
                const cloud = new THREE.Sprite(spriteMaterial);
                const angle = (i / numClouds) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.random() * 3 + heightOffset;
                cloud.position.set(x, y, z);
                cloud.scale.set(50, 35, 1);
                cloudGroup.add(cloud);
            }
        }
        this.add(cloudGroup);
    }

    spawnCollectibles() {
        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * this.grid.columns * this.grid.cellSize;
            const y = Math.random() * 50;
            const z = (Math.random() - 0.5) * this.grid.rows * this.grid.cellSize;
            const collectible = new Collectible(new THREE.Vector3(x, y, z));
            this.collectibles.push(collectible);
            this.add(collectible.mesh);
            //console.log(`Objet placé à : x=${x}, y=${y}, z=${z}`);
        }
    }

    restartMission() {
        const messageElement = document.getElementById("message");
        messageElement.classList.add('hidden');
        this.isMissionOver = false;
        this.objectsCollected = 0;
        this.timeLeft = 60;
        this.clearCollectibles();
        this.spawnCollectibles();
        this.updateUI();
        this.startTimer();
        this.hideMessage();
    }

    bindRestartButton() {
        const restartButton = document.getElementById("restart-btn");
        restartButton.addEventListener("click", () => {
            this.restartMission();
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.showMessage("TEMPS ÉCOULÉ ! MISSION ÉCHOUÉE.");
            }
        }, 1000);
    }

    onKeyPress(event) {
        if (event.key.toLowerCase() === "a") {
            this.shootWeapon();
        }
    }

    updateUI() {
        document.getElementById("counter").innerText = `OBJETS COLLECTÉS : ${this.objectsCollected} / 10`;
    }

    updateTimerUI() {
        document.getElementById("timer").innerText = `TEMPS RESTANT : ${this.timeLeft}s`;
    }

    showMessage(message) {
        const messageElement = document.getElementById("message");
        const messageText = document.getElementById("message-text");
        messageText.innerText = message;
        messageElement.classList.remove("hidden");
        messageElement.style.display = "block";
        this.isMissionOver = true;
    }

    hideMessage() {
        const messageElement = document.getElementById("message");
        messageElement.classList.add("hidden");
        messageElement.style.display = "none";
    }

    clearCollectibles() {
        for (let i = 0; i < this.collectibles.length; i++) {
            const collectible = this.collectibles[i];
            this.remove(collectible.mesh);
            collectible.mesh.geometry.dispose();
            collectible.mesh.material.dispose();
        }
        this.collectibles = [];
    }

    createExplosion(position) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;

            velocities.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                )
            );
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xff66cc,
            size: 0.5,
            transparent: true,
            opacity: 1
        });

        const particles = new THREE.Points(geometry, material);
        this.add(particles);

        let frame = 0;
        const maxFrames = 30;

        const animateExplosion = () => {
            if (frame > maxFrames) {
                this.remove(particles);
                geometry.dispose();
                material.dispose();
                return;
            }

            const positionsArray = geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positionsArray[i * 3] += velocities[i].x * 0.2;
                positionsArray[i * 3 + 1] += velocities[i].y * 0.2;
                positionsArray[i * 3 + 2] += velocities[i].z * 0.2;
            }

            geometry.attributes.position.needsUpdate = true;
            frame++;
            requestAnimationFrame(animateExplosion);
        };

        animateExplosion();
    }

    loadWeapon() {
        const loader = new GLTFLoader();
        loader.load('./assets/models/shockwave_gun/scene.gltf', (gltf) => {
            this.weapon = gltf.scene;
            this.weapon.scale.set(2, 2, 2);
            this.weapon.position.set(2, -1.5, -2);
            this.weapon.rotation.y = Math.PI;
            this.camera.add(this.weapon);
            this.scene.add(this.camera);
        }, undefined, (error) => {
            console.error("Erreur lors du chargement de l'arme :", error);
        });
    }

    shootWeapon() {
        if (this.isMissionOver) return;
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        raycaster.set(this.camera.position, direction);
        const intersects = raycaster.intersectObjects(this.collectibles.map(obj => obj.mesh));
        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            const index = this.collectibles.findIndex(obj => obj.mesh === hitObject);

            if (index !== -1) {
                const collectible = this.collectibles[index];
                this.createExplosion(collectible.mesh.position);
                setTimeout(() => {
                    this.remove(collectible.mesh);
                    collectible.mesh.geometry.dispose();
                    collectible.mesh.material.dispose();
                    this.collectibles.splice(index, 1);
                }, 100);
                this.objectsCollected++;
                console.log(`Objets collectés : ${this.objectsCollected}/10`);
                this.updateUI();
                if (this.objectsCollected === 10) {
                    clearInterval(this.timerInterval);
                    this.showMessage("FÉLICITATIONS ! MISSION RÉUSSIE !");
                }
            }
        }
    }

    checkTarget() {
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        raycaster.set(this.camera.position, direction);

        this.collectibles.forEach(obj => obj.mesh.material.color.set(0xffffff));

        const intersects = raycaster.intersectObjects(this.collectibles.map(obj => obj.mesh));
        if (intersects.length > 0) {
            const target = intersects[0].object;
            target.material.color.set(0xff0000);
        }
    }

    checkTargetLoop() {
        setInterval(() => this.checkTarget(), 100);
    }

    createCrosshair() {
        const crosshair = document.createElement("div");
        crosshair.style.position = "absolute";
        crosshair.style.top = "50%";
        crosshair.style.left = "50%";
        crosshair.style.width = "10px";
        crosshair.style.height = "10px";
        crosshair.style.backgroundColor = "#ff66cc";
        crosshair.style.borderRadius = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.zIndex = "1000";
        document.body.appendChild(crosshair);
    }
}
