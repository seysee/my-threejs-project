import * as THREE from "three";
import {Grid} from "./grid.js";
import {Building} from "./building.js";
import {Ground} from "./ground.js";
import {Skyscraper} from "./skyscraper.js";
import {BuildingModel} from "./BuildingModel.js";
import {BuildingEntrance} from "./BuildingEntrance.js";

export class World extends THREE.Group {
    constructor(seed) {
        super();
        this.seed = seed;
        this.grid = new Grid(5, 5, 20);
        const ground = new Ground(this.grid.rows * this.grid.cellSize);
        this.add(ground.mesh);

        this.generate().then(() => {
            console.log("La génération du monde est terminée.");
        }).catch((error) => {
            console.error("Erreur lors de la génération du monde :", error);
        });

        this.add(this.grid.group);
    }

    async generate() {
        const layout = [
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "customBuilding", "skyscraper", "customBuilding", "empty"],
            ["empty", "building", "building", "skyscraper", "empty"],
            ["empty", "customBuilding", "scifiEntrance", "customBuilding", "empty"],
            ["empty", "empty", "empty", "empty", "empty"]
        ];

        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.columns; col++) {
                const position = new THREE.Vector3(
                    (col - (this.grid.columns - 1) / 2) * this.grid.cellSize,
                    0,
                    (row - (this.grid.rows - 1) / 2) * this.grid.cellSize
                );

                const type = layout[row][col];

                if (type === "building") {
                    const building = new Building(10, 20, 10, position);
                    this.grid.placeInCell(row, col, building);
                } else if (type === "skyscraper") {
                    const skyscraper = new Skyscraper(10, 50, 10, position);
                    this.grid.placeInCell(row, col, skyscraper);
                } else if (type === "customBuilding") {
                    const customBuilding = new BuildingModel('./assets/models/sky_t_021_gltf/scene.gltf', position);
                    await customBuilding.loadModel();
                    this.grid.placeInCell(row, col, customBuilding);
                } else if (type === "scifiEntrance") {
                    const scifiEntrance = new BuildingEntrance('./assets/models/scifi_building_entrance_gltf/scene.gltf', position);
                    await scifiEntrance.loadModel();
                    this.grid.placeInCell(row, col, scifiEntrance);
                }
            }
        }
    }
}
