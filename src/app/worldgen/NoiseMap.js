import { Vector2 } from "three";
import { FBM, Perlin } from "three-noise";
import { SimplexNoise } from "three/examples/jsm/Addons.js";
import { randInt } from "three/src/math/MathUtils.js";
import { log } from "three/tsl";
import Voronoi from "voronoi";

export default class NoiseMap {
    scale = 0;
    height = this.scale;
    width = this.scale;
    offsetX = 0;
    offsetZ = 0;
    multiplyerWht = 20;
    multiplyerPerl = 7;
    /**
     * @type {Perlin}
     */
    perlinGen = null;

    /**
     * @type {FBM}
     */
    whiteGen = null;

    randomPoints([width, height], nPoints, margin = 0) {
        let result = [];
        for (let i = 0; i < nPoints; i++) {
            result.push({
                x: randInt(margin, width - margin),
                y: randInt(margin, height - margin),
            });
        }
        return result;
    }

    constructor(offsetX = 0, offsetY = 0, scale = 400) {
        this.offsetX = offsetX;
        this.offsetZ = offsetY;
        this.scale = scale;
        this.height = scale;
        this.width = scale;
        let seed = 12321323;
        this.perlinGen = new Perlin(seed);
        this.whiteGen = new FBM({
            seed: seed,
        });
    }

    perl(nx, ny) {
        let velocity = this.perlinGen.get2(
            new Vector2(nx, ny),
            new Vector2(nx, ny)
        );
        let height = velocity;
        height = velocity / 2 + 1;
        return height;
    }

    wht(nx, ny) {
        let velocity = this.whiteGen.get2(
            new Vector2(nx, ny),
            new Vector2(nx, ny)
        );
        let height = velocity;
        height = velocity / 2 + 1;
        return height;
    }

    setOffset(x, z) {
        this.offsetX = x;
        this.offsetZ = z;
    }

    generate() {
        let map = [];
        for (let z = 0; z < this.height; z++) {
            map[z] = [];
            for (let x = 0; x < this.width; x++) {
                let nxx = (x / this.width) * this.multiplyerPerl - 0.5,
                    nyy = (z / this.height) * this.multiplyerPerl - 0.5;

                let nx = (x / this.width) * this.multiplyerWht,
                    ny = (z / this.height) * this.multiplyerWht;

                let val = this.perl(nxx, nyy) / this.wht(nx, ny);
                map[z][x] = Math.round(val * 10);
            }
        }
        return map;
    }
}
