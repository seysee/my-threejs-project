import * as THREE from "three";

export class Ground {
    constructor(size, thickness = 2) {
        const geometry = new THREE.BoxGeometry(size, thickness, size);
        const material = new THREE.MeshStandardMaterial({ color: "#222222" });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = -thickness / 2;
    }
}
