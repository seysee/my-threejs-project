import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Ground {
    constructor(size, thickness = 2, scene) {
        this.mesh = new THREE.Group();

        this.loader = new GLTFLoader();
        this.loader.load(
            "./assets/models/floor/floor.glb",
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(size / 4, 1, size / 4);
                model.position.set(0, -thickness / 2, 0);
                this.mesh.add(model);
            },
            undefined,
            (error) => {
                console.error("Erreur lors du chargement du modèle de sol :", error);
            }
        );
    }
}
