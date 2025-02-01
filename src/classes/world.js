import * as THREE from "three";
import { Ground } from "./Ground.js";
import { Building } from "./Building.js";
import { Billboard } from "./Billboard.js";
import { GiantScreen } from "./GiantScreen.js";

function random(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export class World extends THREE.Group {
    constructor(seed = 42, size = 300, numBuildings = 50) {
        super();
        this.seed = seed;
        this.size = size;
        this.numBuildings = numBuildings;
        this.textures = ["./assets/textures/ads_01.jpg", "./assets/textures/ads_02.jpg", "./assets/textures/ads_03.jpg"];
        this.fixedElements = [];
    }

    generate() {
        const ground = new Ground(this.size);
        this.add(ground.mesh);

        let seed = this.seed;
        const halfSize = this.size / 2 - 10;

        for (let i = 0; i < this.numBuildings; i++) {
            const position = new THREE.Vector3(
                Math.max(Math.min(random(seed++) * (this.size - 20) - this.size / 2, halfSize), -halfSize),
                0,
                Math.max(Math.min(random(seed++) * (this.size - 20) - this.size / 2, halfSize), -halfSize)
            );

            const width = random(seed++) * 4 + 10;
            const height = random(seed++) * 40 + 20;
            const depth = random(seed++) * 4 + 10;

            const building = new Building(width, height, depth, position);
            building.mesh.position.y = building.mesh.geometry.parameters.height / 2;
            this.add(building.mesh);

            if (random(seed++) > 0.5) {
                const billboardWidth = width * 0.6;
                const billboardHeight = height * 0.3;
                const billboardPosition = position.clone().add(new THREE.Vector3(0, height / 2, depth / 2 + 0.1));
                if (Math.abs(billboardPosition.x) <= halfSize && Math.abs(billboardPosition.z) <= halfSize) {
                    const facadeBillboard = new Billboard(billboardWidth, billboardHeight, billboardPosition, this.randomTexture(seed));
                    facadeBillboard.mesh.rotation.y = Math.PI;
                    this.add(facadeBillboard.mesh);
                    this.fixedElements.push({ type: "billboard", mesh: facadeBillboard.mesh });
                }
            }

            if (random(seed++) > 0.6) {
                const screenPosition = position.clone().add(new THREE.Vector3(0, 30, -5));
                if (Math.abs(screenPosition.x) <= halfSize && Math.abs(screenPosition.z) <= halfSize) {
                    const screen = new GiantScreen(20, 15, screenPosition, this.randomTexture(seed));
                    this.add(screen.mesh);
                    this.fixedElements.push({ type: "giantScreen", mesh: screen.mesh });
                }
            }
        }
    }

    randomTexture(seed) {
        const index = Math.floor(random(seed) * this.textures.length);
        return this.textures[index];
    }
}
