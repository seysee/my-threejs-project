import * as THREE from "three";
import { Grid } from "./grid.js";
import { Road } from "./road.js";
import { Ground } from "./ground.js";
import { Building } from "./building.js";
import { Skyscraper } from "./skyscraper.js";
import { BuildingModel } from "./BuildingModel.js";
import { BuildingEntrance } from "./BuildingEntrance.js";
import { Collectible } from "./object.js";

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
        }).catch((error) => {
            console.error("Erreur lors de la génération du monde :", error);
        });

        this.createClouds();
        this.add(this.grid.group);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        window.addEventListener("click", (event) => this.onMouseClick(event));
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
                else if (type === "road") {
                    const road = new Road(this.grid.cellSize, position);
                    this.grid.placeInCell(row, col, road);
                    this.add(road.mesh);
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

            console.log(`Objet placé à : x=${x}, y=${y}, z=${z}`);
        }
    }

    onMouseClick(event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.collectibles.map(obj => obj.mesh));
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const index = this.collectibles.findIndex(obj => obj.mesh === clickedObject);
            if (index !== -1) {
                const collectible = this.collectibles[index];
                this.remove(collectible.mesh);
                collectible.mesh.geometry.dispose();
                collectible.mesh.material.dispose();
                this.collectibles.splice(index, 1);
            }
            this.objectsCollected++;
            console.log(`Objets collectés : ${this.objectsCollected}/10`);
            if (this.objectsCollected === 10) {
                clearInterval(this.timerInterval);
                alert("Félicitations ! Vous avez collecté tous les objets !");
            }
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            console.log(`Temps restant : ${this.timeLeft}s`);

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                alert("Temps écoulé ! Mission échouée.");
            }
        }, 1000);
    }

}
