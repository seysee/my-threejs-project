import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
loader.setDRACOLoader(dracoLoader);
const modelCache = new Map();

export class BuildingEntrance {
    constructor(url, position) {
        this.url = url;
        this.position = position;
        this.mesh = null;
        this.isLoaded = false;
    }

    async loadModel() {
        if (modelCache.has(this.url)) {
            this.mesh = modelCache.get(this.url).clone();
            this.mesh.position.copy(this.position);
            this.isLoaded = true;
            return this;
        }

        return new Promise((resolve, reject) => {
            loader.load(this.url, (gltf) => {
                this.mesh = gltf.scene;
                modelCache.set(this.url, this.mesh.clone());
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
