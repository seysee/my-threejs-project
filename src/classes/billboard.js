import * as THREE from "three";

export class Billboard {
    constructor(width, height, depth = 0.2) {
        this.depth = depth;

        const structureMaterial = new THREE.MeshStandardMaterial({
            color: "#1a1a1a",
            metalness: 0.7,
            roughness: 0.5
        });

        const screenMaterial = new THREE.MeshStandardMaterial({
            emissiveIntensity: 2.5,
            color: "#292929",
            roughness: 0.2,
            metalness: 0.1
        });

        const frameMaterial = new THREE.MeshStandardMaterial({
            color: "#00ccff" ,
            metalness: 0.8,
            roughness: 0.3
        });

        const panelGeometry = new THREE.BoxGeometry(width, height, depth);
        const screenGeometry = new THREE.PlaneGeometry(width - 0.2, height - 0.2);

        const frameThickness = 0.1;
        const frameTop = new THREE.BoxGeometry(width, frameThickness, frameThickness);
        const frameBottom = new THREE.BoxGeometry(width, frameThickness, frameThickness);
        const frameLeft = new THREE.BoxGeometry(frameThickness, height, frameThickness);
        const frameRight = new THREE.BoxGeometry(frameThickness, height, frameThickness);

        this.panel = new THREE.Mesh(panelGeometry, structureMaterial);
        this.screen = new THREE.Mesh(screenGeometry, screenMaterial);
        this.frameTop = new THREE.Mesh(frameTop, frameMaterial);
        this.frameBottom = new THREE.Mesh(frameBottom, frameMaterial);
        this.frameLeft = new THREE.Mesh(frameLeft, frameMaterial);
        this.frameRight = new THREE.Mesh(frameRight, frameMaterial);

        // cadre
        this.frameTop.position.set(0, height / 2, depth / 2);
        this.frameBottom.position.set(0, -height / 2, depth / 2);
        this.frameLeft.position.set(-width / 2, 0, depth / 2);
        this.frameRight.position.set(width / 2, 0, depth / 2);
        this.screen.position.set(0, 0, depth / 2 + 0.01);

        // bras pour accrocher à la façade
        const armGeometry = new THREE.BoxGeometry(0.2, 0.2, 1.5);
        this.arm1 = new THREE.Mesh(armGeometry, structureMaterial);
        this.arm2 = new THREE.Mesh(armGeometry, structureMaterial);
        this.verticalArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, height, 0.2), structureMaterial);

        this.verticalArm.position.set(-width / 2 - 0.5, 0, -depth);
        this.arm1.position.set(-0.75, height / 4, 0);
        this.arm2.position.set(-0.75, -height / 4, 0);

        this.arm1.rotation.y = Math.PI / 2;
        this.arm2.rotation.y = Math.PI / 2;
        this.verticalArm.add(this.arm1);
        this.verticalArm.add(this.arm2);

        this.mesh = new THREE.Group();
        this.mesh.add(this.panel);
        this.mesh.add(this.screen);
        this.mesh.add(this.frameTop);
        this.mesh.add(this.frameBottom);
        this.mesh.add(this.frameLeft);
        this.mesh.add(this.frameRight);
        this.mesh.add(this.arm1);
        this.mesh.add(this.arm2);
        this.mesh.add(this.verticalArm);

        this.addJapaneseText("居酒屋", width - 0.2, height - 0.2);
    }

    addJapaneseText(text, width, height) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 1024;
        canvas.height = 2048;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#c71585";
        ctx.font = "bold 500px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        //texte en vertical
        const chars = text.split("");
        let spacing = canvas.height / (chars.length);
        let y = canvas.height / 2 - ((chars.length - 1) * spacing) / 2;

        for (let char of chars) {
            ctx.fillText(char, canvas.width / 2, y);
            y += spacing;
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), textMaterial);
        textPlane.position.set(0, 0, this.depth / 2 + 0.02);
        this.mesh.add(textPlane);
    }
}
