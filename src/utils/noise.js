export class Noise {
    constructor() {}

    generate(size, scale = 1) {
        const noiseArray = [];
        for (let i = 0; i < size; i++) {
            noiseArray.push(Math.random() * scale);
        }
        return noiseArray;
    }
}
