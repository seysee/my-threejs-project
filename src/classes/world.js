import * as THREE from "three";
import { Grid } from "./grid.js";
import { Building } from "./building.js";
import { Ground } from "./ground.js";
import { Skyscraper } from "./skyscraper.js";

export class World extends THREE.Group {
    constructor(seed) {
        super();
        this.seed = seed;
        this.grid = new Grid(4, 4, 20);
        const ground = new Ground(this.grid.rows * this.grid.cellSize);
        this.add(ground.mesh);
        this.generate();
        this.add(this.grid.group);
    }

    generate() {
        const layout = [
            ["skyscraper", "empty", "building", "skyscraper"],
            ["building", "empty", "empty", "building"],
            ["building", "empty", "empty", "building"],
            ["skyscraper", "building", "building", "skyscraper"]
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
                }
            }
        }
    }
}
