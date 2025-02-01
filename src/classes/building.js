import * as THREE from "three";

export class Building {
    constructor(width, height, depth, position) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: "#dad3cb" });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
    }
}