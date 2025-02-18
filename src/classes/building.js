import * as THREE from "three";

export class Building {
    constructor(width, height, depth, position) {
        this.width = width;
        this.height = height;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: "#2e2c2c",
            roughness: 0.5,
            metalness: 0.8
        });
        this.mesh = new THREE.Mesh(geometry, material);
        position.y = height / 2;
        this.mesh.position.copy(position);

        this.seed = this.generateSeed(position);
        this.addWindows(width, height, depth);
        this.addRoofLight();
    }

    generateSeed(position) {
        return Math.abs(Math.floor(position.x * 73856093 ^ position.y * 19349663 ^ position.z * 83492791)) % 1000000;
    }

    seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    addWindows(width, height, depth) {
        const numRows = 8;
        const numCols = 8;
        const marginX = width * 0.05;
        const marginY = height * 0.05;
        const windowWidth = (width - 2 * marginX) / numCols * 0.9;
        const windowHeight = (height - 2 * marginY) / numRows * 0.9;
        const windowDepth = 0.05;
        const neonColors = ["#2a7fff", "#c71585"];
        const offColor = "#010b1b";

        let currentSeed = this.seed;

        for (let row = 0; row < numRows; row++) {
            const yPos = height / 2 - marginY - (row + 0.5) * ((height - 2 * marginY) / numRows);

            for (let col = 0; col < numCols; col++) {
                const xPos = -width / 2 + marginX + (col + 0.5) * ((width - 2 * marginX) / numCols);
                const randomValue = this.seededRandom(currentSeed++);
                const color = randomValue > 0.7 ? neonColors[Math.floor(this.seededRandom(currentSeed++) * neonColors.length)] : offColor;

                this.createWindow(xPos, yPos, depth / 2 - 0.02, windowWidth, windowHeight, windowDepth, color);
                this.createWindow(xPos, yPos, -depth / 2 + 0.02, windowWidth, windowHeight, windowDepth, color);
            }
        }
    }

    createWindow(xOffset, yPos, zOffset, windowWidth, windowHeight, windowDepth, color) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
        const isNeon = color !== "#081837";
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: isNeon ? color : "#000",
            emissiveIntensity: isNeon ? 0.8 : 0,
            roughness: 0.2,
            metalness: 0.5,
            side: THREE.DoubleSide
        });
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(xOffset, yPos, zOffset);
        this.mesh.add(windowMesh);
    }

    addRoofLight() {
        const lightGeometry = new THREE.CircleGeometry(this.width * 0.25, 32);
        const lightMaterial = new THREE.MeshStandardMaterial({
            emissive: "#ffff66",
            emissiveIntensity: 2,
            color: "#ffff66"
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.rotation.x = -Math.PI / 2;
        lightMesh.position.set(0, this.height / 2 + 0.01, 0);
        this.mesh.add(lightMesh);
    }
}
