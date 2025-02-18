import * as THREE from "three";

export class Road {
    constructor(cellSize, position) {
        this.mesh = new THREE.Group();

        const lineLength = cellSize * 0.3;
        const lineWidth = cellSize * 0.05;
        const lineHeight = 0.05;
        const lineMaterial = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });

        const line1Geometry = new THREE.BoxGeometry(lineLength, lineHeight, lineWidth);
        const line1 = new THREE.Mesh(line1Geometry, lineMaterial);
        line1.position.set(-cellSize * 0.25, 0.15, 0);

        const line2Geometry = new THREE.BoxGeometry(lineLength, lineHeight, lineWidth);
        const line2 = new THREE.Mesh(line2Geometry, lineMaterial);
        line2.position.set(cellSize * 0.25, 0.15, 0);

        this.mesh.add(line1);
        this.mesh.add(line2);

        this.mesh.position.copy(position);
    }
}
