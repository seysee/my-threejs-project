import * as THREE from "three";

export class GiantScreen {
    constructor(width, height, position, texturePath) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const texture = new THREE.TextureLoader().load(texturePath);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        const frameThickness = 2;
        const frameGeometry = new THREE.BoxGeometry(width * 1.1, height * 1.1, frameThickness);
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, -frameThickness / 2);
        this.mesh.add(frame);
    }
}
