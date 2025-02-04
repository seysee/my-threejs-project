import * as THREE from "three";

export class Grid {
    constructor(rows, columns, cellSize) {
        this.rows = rows;
        this.columns = columns;
        this.cellSize = cellSize;
        this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
        this.group = new THREE.Group();
    }

    placeInCell(row, column, element) {
        if (this.isValidCell(row, column)) {
            const x = (column - (this.columns - 1) / 2) * this.cellSize;
            const z = (row - (this.rows - 1) / 2) * this.cellSize;

            element.mesh.position.set(x, element.mesh.position.y, z);

            if (this.grid[row][column]) {
                this.group.remove(this.grid[row][column].mesh);
            }

            this.grid[row][column] = element;
            this.group.add(element.mesh);
        } else {
            console.error("position hors de la grille", { row, column });
        }
    }

    isValidCell(row, column) {
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
    }
}
