import * as THREE from "three";

export class Ground {
    constructor(size) {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshStandardMaterial({ color: "#b0aa9d", side: THREE.DoubleSide });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = -2;
        this.size = size;
    }
}