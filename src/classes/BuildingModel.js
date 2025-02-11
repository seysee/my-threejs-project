import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class BuildingModel {
    constructor(url, position) {
        this.url = url;
        this.position = position;
        this.mesh = null;
        this.isLoaded = false;
    }

    loadModel() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(this.url, (gltf) => {
                this.mesh = gltf.scene;
                this.mesh.position.copy(this.position);
                this.mesh.scale.set(0.5, 0.5, 0.5);
                this.isLoaded = true;
                resolve(this);
            }, undefined, (error) => {
                console.error('Erreur lors du chargement du modèle', error);
                reject(error);
            });
        });
    }
}