import * as THREE from "three";

export class Collectible {
    constructor(position) {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0xff66cc, emissive: 0xaa3366 })
        );
        this.mesh.position.copy(position);
    }
}
