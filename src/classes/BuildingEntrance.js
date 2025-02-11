import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class BuildingEntrance {
    constructor(url, position) {
        this.url = url;
        this.position = position;
        this.mesh = null;
        this.isLoaded = false;

        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        this.loader.setDRACOLoader(this.dracoLoader);
    }

    loadModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(this.url, (gltf) => {
                this.mesh = gltf.scene;
                this.mesh.position.copy(this.position);
                this.mesh.scale.set(1, 1, 1);
                this.isLoaded = true;
                resolve(this);
            }, undefined, (error) => {
                console.error('❌ Erreur lors du chargement du modèle', error);
                reject(error);
            });
        });
    }
}
