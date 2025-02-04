import * as THREE from "three";

export class Skyscraper {
    constructor(width, height, depth, position) {
        const heightReductionFactor = 0.7;
        this.height = height * heightReductionFactor;
        this.mesh = new THREE.Group();
        this.mesh.position.copy(position);

        this.addSection(width, this.height * 0.6, depth, 0, "#1e1e1e", "patterned");
        this.addSection(width * 0.6, this.height * 0.4, depth * 0.6, this.height * 0.6, "#1a1a1a", true);
        this.addRoof(width, depth);
    }

    addSection(width, height, depth, yOffset, color, windowMode) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.9,
        });
        const section = new THREE.Mesh(geometry, material);
        section.position.y = yOffset + height / 2;

        if (windowMode) {
            this.addWindows(section, width, height, depth, windowMode);
        }

        this.mesh.add(section);
    }

    addWindows(section, width, height, depth, mode) {
        const windowWidth = 0.3;
        const windowHeight = height * 0.9;
        const spacing = 0.3;
        const positions = [
            { x: 0, z: depth / 2 + 0.03, rotationY: 0 },
            { x: 0, z: -depth / 2 - 0.03, rotationY: 0 },
            { x: width / 2 + 0.03, z: 0, rotationY: Math.PI / 2 },
            { x: -width / 2 - 0.03, z: 0, rotationY: Math.PI / 2 }
        ];

        positions.forEach(pos => {
            if (mode === "patterned") {
                const pattern = [3, 5, 3];
                const totalWindows = pattern.reduce((a, b) => a + b, 0);
                const totalSpacing = (pattern.length - 1) * spacing * 3 + (totalWindows - pattern.length) * spacing;
                const totalWidth = totalWindows * windowWidth + totalSpacing;
                let offsetX = -totalWidth / 2;

                pattern.forEach((count) => {
                    for (let i = 0; i < count; i++) {
                        const xPos = offsetX + i * (windowWidth + spacing);
                        const geometry = new THREE.BoxGeometry(windowWidth, windowHeight, 0.05);
                        const material = new THREE.MeshStandardMaterial({
                            emissive: new THREE.Color(this.getVerticalGradientColor(i, count, height, windowHeight)),
                            emissiveIntensity: 2,
                            color: 0x000000,
                        });

                        const windowMesh = new THREE.Mesh(geometry, material);
                        if (pos.rotationY === 0) {
                            windowMesh.position.set(xPos + windowWidth / 2, 0, pos.z);
                        } else {
                            windowMesh.position.set(pos.x, 0, xPos + windowWidth / 2);
                            windowMesh.rotation.y = pos.rotationY;
                        }
                        section.add(windowMesh);
                    }
                    offsetX += count * (windowWidth + spacing) + spacing * 3;
                });
            } else {
                const numWindows = Math.floor((width - spacing) / (windowWidth + spacing));
                for (let i = 0; i < numWindows; i++) {
                    const offset = -width / 2 + spacing + i * (windowWidth + spacing) + windowWidth / 2;

                    const geometry = new THREE.BoxGeometry(windowWidth, windowHeight, 0.05);
                    const material = new THREE.MeshStandardMaterial({
                        emissive: new THREE.Color(this.getVerticalGradientColor(i, numWindows, height, windowHeight)),
                        emissiveIntensity: 2,
                        color: 0x000000,
                    });

                    const windowMesh = new THREE.Mesh(geometry, material);
                    if (pos.rotationY === 0) {
                        windowMesh.position.set(offset, 0, pos.z);
                    } else {
                        windowMesh.position.set(pos.x, 0, offset);
                        windowMesh.rotation.y = pos.rotationY;
                    }
                    section.add(windowMesh);
                }
            }
        });
    }

    getVerticalGradientColor(index, total, maxHeight) {
        const ratio = index / total;
        const startColor = new THREE.Color("#2a7fff");
        const endColor = new THREE.Color("#c71585");
        const lerpHeight = ratio * maxHeight;

        return startColor.lerp(endColor, lerpHeight / maxHeight);
    }

    addRoof(width, depth) {
        const roofWidth = width * 0.4;
        const roofDepth = depth * 0.4;
        const geometry = new THREE.BoxGeometry(roofWidth, 1.5, roofDepth);
        const material = new THREE.MeshStandardMaterial({
            color: "rgba(67,66,66,0.5)",
            roughness: 0.5,
            metalness: 0.9,
        });
        const roof = new THREE.Mesh(geometry, material);
        roof.position.y = this.height + 0.1;
        this.mesh.add(roof);
    }
}
