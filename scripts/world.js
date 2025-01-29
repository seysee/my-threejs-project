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

            if (Math.floor(random(seed++) * 10) > 7) {
                const billboard = this.createBillboard(width * 0.6, height * 0.3);
                billboard.position.set(x, height / 2, z + width / 2 + 0.5);
                billboard.rotation.y = 0;
                this.add(billboard);
            }

        }

        for (let i = 0; i < 5; i++) {
            const screenWidth = random(seed++) * 10 + 15;
            const screenHeight = random(seed++) * 15 + 10;
            const screen = this.createGiantScreen(screenWidth, screenHeight);

            let tries = 0;
            while (tries < 10) {
                const groundHeight = -2;
                if (screen.position.y - screenHeight / 2 > groundHeight) {
                    break;
                }
                screen.position.set(random(seed++) * this.size - this.size / 2, screenHeight / 2 + 1, random(seed++) * this.size - this.size / 2);
                tries++;
            }
            screen.rotation.y = Math.random() * Math.PI;
            this.add(screen);
        }

    }

    createBuilding(width, height, depth) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: "#dad3cb" });
        return new THREE.Mesh(geometry, material);
    }

    createBillboard(width, height) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({
            color: "white",
            side: THREE.DoubleSide
        });
        const billboard = new THREE.Mesh(geometry, material);
        return billboard;
    }

    createGiantScreen(width, height) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({
            color: "#282626",
            side: THREE.DoubleSide
        });

        const frameThickness = 2;
        const frameGeometry = new THREE.BoxGeometry(width * 1.1, height * 1.1, frameThickness);
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, 0);

        const screen = new THREE.Mesh(geometry, material);
        screen.add(frame);

        const baseHeight = -(height / 2 + 2);
        const baseGeometry = new THREE.CylinderGeometry(3, 3, 5, 8);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, baseHeight, 0);
        screen.add(base);

        return screen;
    }

}
