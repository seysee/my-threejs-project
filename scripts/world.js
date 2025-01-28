import * as THREE from 'three';

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({color: 0x00d000});

export class World extends THREE.Group{
    constructor(size = 32){
        super();
        this.size = size;
    }

    generate() {
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++) {
                const building = this.createBuilding(10, 30, 10, 0x00ff00);
                building.position.set(x * 12, 15, z * 12);
                this.add(building);
            }
        }
    }

    createBuilding(width, height, depth, color) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color: color });
        const building = new THREE.Mesh(geometry, material);
        return building;
    }
}