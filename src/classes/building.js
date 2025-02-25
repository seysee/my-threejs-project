import * as THREE from "three";

export class Building {
    constructor(width, height, depth, position) {
        this.width = width;
        this.height = height;

        const textureLoader = new THREE.TextureLoader();

        const baseColor = textureLoader.load("./assets/textures/baseColor.jpg");
        const normal = textureLoader.load("./assets/textures/building_01_normal.jpg");
        const roughness = textureLoader.load("./assets/textures/building_01_roughness.jpg");
        const ao = textureLoader.load("./assets/textures/building_01_ambientOcclusion.jpg");
        const metalness = textureLoader.load("./assets/textures/building_01_metalic.jpg");

        [baseColor, normal, roughness, ao, metalness].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(Math.max(1, width / 10), Math.max(1, height / 10));
                texture.encoding = THREE.sRGBEncoding;
                texture.anisotropy = 16;
            }
        });


        const facadeMaterial = new THREE.MeshStandardMaterial({
            map: baseColor,
            normalMap: normal,
            roughnessMap: roughness,
            aoMap: ao,
            metalnessMap: metalness,
            side: THREE.DoubleSide,
        });

        const roofMaterial = new THREE.MeshStandardMaterial({ color: "#2e2c2c" });

        const materialArray = [
            facadeMaterial,
            facadeMaterial,
            roofMaterial,
            roofMaterial,
            facadeMaterial,
            facadeMaterial
        ];

        const geometry = new THREE.BoxGeometry(width, height, depth, 10, 10, 10);

        this.mesh = new THREE.Mesh(geometry, materialArray);
        this.mesh.position.set(position.x, height / 2, position.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.addRoofLight();
    }

    addRoofLight() {
        const lightGeometry = new THREE.CircleGeometry(this.width * 0.25, 32);
        const lightMaterial = new THREE.MeshStandardMaterial({
            emissive: "#ffff66",
            emissiveIntensity: 2,
            color: "#ffff66"
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.rotation.x = -Math.PI / 2;
        lightMesh.position.set(0, this.height / 2 + 0.01, 0);
        this.mesh.add(lightMesh);
    }
}