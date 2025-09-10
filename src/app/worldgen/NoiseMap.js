import { Vector2 } from "three";
import { FBM, Perlin } from "three-noise";
import { SimplexNoise } from "three/examples/jsm/Addons.js";
import { randInt } from "three/src/math/MathUtils.js";
import { log } from "three/tsl";
import Voronoi from "voronoi";
import NoiseGenProperty from "./types/NoiseGenProperty";

export default class NoiseMap {
    scale = 1500;
    height = this.scale;
    width = this.scale;
    offsetX = 0;
    offsetZ = 0;
    multiplyerWht = 20 / 2;
    multiplyerPerl = 15;
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

    constructor(offsetX = 0, offsetY = 0) {
        this.offsetX = offsetX;
        this.offsetZ = offsetY;
        let seed = 1232122323;
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
    generate(
        params = new NoiseGenProperty
    ) {
        let noiseCord = (cord, side, mlt) => {
            return (cord / side) * mlt + 10;
        };
        let map = [];
        for (let z = 0; z < params.getValue('chunkScale'); z++) {
            map[z] = [];
            for (let x = 0; x < params.getValue('chunkScale'); x++) {
                let nxx = noiseCord(
                        x + params.getValue('offsetX'),
                        this.width,
                        this.multiplyerPerl
                    ),
                    nyy = noiseCord(
                        z + params.getValue('offsetZ'),
                        this.height,
                        this.multiplyerPerl
                    );

                let nx = noiseCord(
                        x + params.getValue('offsetX'),
                        this.width,
                        this.multiplyerWht
                    ),
                    ny = noiseCord(
                        z + params.getValue('offsetZ'),
                        this.height,
                        this.multiplyerWht
                    );

                let val =
                    (this.perl(nxx, nyy) / this.wht(nx, ny)) *
                        (Math.log(params.getValue('heightFunc')) * params.getValue('fullHeight')) -
                    params.getValue('heightOffset');
                map[z][x] = Math.floor(val * 10);
            }
        }
        return map;
    }
}
