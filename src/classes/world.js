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
            const building = this.createBuildingOnRoad(seed);
            this.add(building);

            if (Math.floor(random(seed++) * 10) > 7) {
                const billboard = this.createBillboardOnRoad(building, seed);
                this.add(billboard);
            }
            if (Math.floor(random(seed++) * 10) > 6) {
                const screen = this.createGiantScreenOnRoad(building, seed);
                this.add(screen);
            }
        }
    }

    createBuildingOnRoad(seed) {
        const width = random(seed++) * 4 + 8;
        const height = random(seed++) * 40 + 20;
        const depth = random(seed++) * 4 + 8;

        let x = random(seed++) * (this.size - 20) - this.size / 2;
        let z = random(seed++) * (this.size - 20) - this.size / 2;

        const building = this.createBuilding(width, height, depth);
        building.position.set(x, height / 2, z);
        return building;
    }

    createBillboardOnRoad(building, seed) {
        const width = building.geometry.parameters.width * 0.6;
        const height = building.geometry.parameters.height * 0.3;
        const billboard = this.createBillboard(width, height);

        const x = building.position.x;
        const z = building.position.z + building.geometry.parameters.depth / 2 + 0.1;
        billboard.position.set(x, building.position.y + height / 2, z);
        billboard.rotation.y = Math.PI;
        this.applyImageOnBillboard(billboard);

        return billboard;
    }

    applyImageOnBillboard(billboard) {
        const textureLoader = new THREE.TextureLoader();
        const textures = [
            "./assets/textures/ads_01.jpg",
            "./assets/textures/ads_02.jpg",
            "./assets/textures/ads_03.jpg",
            "./assets/textures/ads_04.jpg",
            "./assets/textures/ads_05.jpg",
        ];

        const randomTexture = textures[Math.floor(Math.random() * textures.length)];
        const texture = textureLoader.load(
            randomTexture,
            () => console.log("Texture du panneau chargée :", randomTexture),
            undefined,
            () => console.error("Erreur de chargement de la texture du panneau :", randomTexture)
        );

        billboard.material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
    }

    createGiantScreenOnRoad(building, seed) {
        const width = random(seed++) * 10 + 15;
        const height = random(seed++) * 15 + 10;
        const screen = this.createGiantScreen(width, height);

        const side = Math.floor(random(seed++) * 10);

        if (side === 0) {
            screen.position.set(building.position.x, building.position.y + height / 2, building.position.z + building.geometry.parameters.depth / 2 + 0.1);
            screen.rotation.y = Math.PI;
        } else if (side === 1) {
            screen.position.set(building.position.x, building.position.y + height / 2, building.position.z - building.geometry.parameters.depth / 2 - 0.1);
            screen.rotation.y = 0;
        } else if (side === 2) {
            screen.position.set(building.position.x - building.geometry.parameters.width / 2 - 0.1, building.position.y + height / 2, building.position.z);
            screen.rotation.y = Math.PI / 2;
        } else {
            screen.position.set(building.position.x + building.geometry.parameters.width / 2 + 0.1, building.position.y + height / 2, building.position.z);
            screen.rotation.y = -Math.PI / 2;
        }
        this.applyImageOnGiantScreen(screen);
        return screen;
    }

    applyImageOnGiantScreen(screen) {
        const textureLoader = new THREE.TextureLoader();
        const textures = [
            "./assets/textures/ads_01.jpg",
            "./assets/textures/ads_02.jpg",
            "./assets/textures/ads_03.jpg"
        ];

        const randomTexture = textures[Math.floor(Math.random() * textures.length)];
        textureLoader.load(
            randomTexture,
            (texture) => {
                console.log("Texture de l'écran géant chargée :", randomTexture);

                // Mise à jour du matériau de l'écran une fois la texture chargée
                screen.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
            },
            undefined,
            () => {
                console.error("Erreur de chargement de la texture de l'écran géant :", randomTexture);
            }
        );
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
        return new THREE.Mesh(geometry, material);
    }

    createGiantScreen(width, height) {
        const geometry = new THREE.PlaneGeometry(width, height);

        const material = new THREE.MeshStandardMaterial({
            color: "black",
            side: THREE.DoubleSide
        });

        const screen = new THREE.Mesh(geometry, material);
        screen.position.set(0, height / 2, -50);

        const frameThickness = 2;
        const frameGeometry = new THREE.BoxGeometry(width * 1.1, height * 1.1, frameThickness);
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, 0);
        screen.add(frame);

        return screen;
    }
}
