import * as THREE from "three";

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
    }

    generate() {
        // Création du sol avec une certaine épaisseur
        const groundGeometry = new THREE.PlaneGeometry(this.size, this.size, 1, 1);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "#b0aa9d",
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        this.add(ground);

        let seed = this.seed;
        for (let i = 0; i < this.numBuildings; i++) {
            const x = random(seed++) * this.size - this.size / 2;
            const z = random(seed++) * this.size - this.size / 2;
            const width = random(seed++) * 4 + 8;
            const height = random(seed++) * 40 + 20;
            const building = this.createBuilding(width, height, width);

            building.position.set(x, height / 2, z);
            this.add(building);
        }
    }

    createBuilding(width, height, depth) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: "#dad3cb" });
        return new THREE.Mesh(geometry, material);
    }
}
