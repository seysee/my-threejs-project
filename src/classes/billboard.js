import * as THREE from "three";

export class Billboard {
    constructor(width, height, position = new THREE.Vector3(0, 0, 0)) {
        this.width = width;
        this.height = height;

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            side: THREE.DoubleSide,
            emissive: 0xff00ff,
        });

        position.y = height / 2;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
    }
}
