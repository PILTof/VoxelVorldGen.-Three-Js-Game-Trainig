import { Vector2 } from "three";
import { FBM, Perlin } from "three-noise";
import { randInt } from "three/src/math/MathUtils.js";
import NoiseGenProperty from "./types/NoiseGenProperty";

export default class NoiseMap {
    scale = 1500;
    height = this.scale;
    width = this.scale;
    offsetX = 0;
    offsetZ = 0;
    // multiplyerWht = 16;
    multiplyerPerl = 4;
    multiplyerNoiseSelect = 1;
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

    constructor(offsetX = 0, offsetY = 0, seed, mltSeed) {
        this.offsetX = offsetX;
        this.offsetZ = offsetY;
        this.perlinGen = new Perlin(seed);
        this.whiteGen = new FBM({
            seed: seed,
        });
        this.whiteMultiplyerGen = new FBM({
            seed: mltSeed
        })
    }

    mltWhiteNoise(nx, ny) {
        let velocity = this.whiteMultiplyerGen.get2(
            new Vector2(nx, ny),
            new Vector2(nx, ny)
        );
        let height = velocity;
        return height * 100;
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
    /**
     * Генерирует чанк через три карты шума:
     * отноешние карты шума перлинга(1) к (карта шума(2) с мультплаеров зависящим от независимой карты шума(3))
     * @param {NoiseGenProperty} params 
     * @returns 
     */
    generate(params = new NoiseGenProperty()) {
        let noiseCord = (cord, side, mlt) => {
            return (cord / side) * mlt + 10;
        };
        let map = [];
        for (
            let z = 0;
            z < params.getValue(NoiseGenProperty.CHUNK_SCALE);
            z++
        ) {
            map[z] = [];
            for (
                let x = 0;
                x < params.getValue(NoiseGenProperty.CHUNK_SCALE);
                x++
            ) {


                let nxxx = noiseCord(
                        x + params.getValue(NoiseGenProperty.OFFSET_X),
                        this.width,
                        this.multiplyerNoiseSelect
                    ),
                    nyyy = noiseCord(
                        z + params.getValue(NoiseGenProperty.OFFSET_Z),
                        this.height,
                        this.multiplyerNoiseSelect
                    );

                
                let whiteNoiseMultiplyer = this.mltWhiteNoise(nxxx, nyyy);


                let nxx = noiseCord(
                        x + params.getValue(NoiseGenProperty.OFFSET_X),
                        this.width,
                        this.multiplyerPerl
                    ),
                    nyy = noiseCord(
                        z + params.getValue(NoiseGenProperty.OFFSET_Z),
                        this.height,
                        this.multiplyerPerl
                    );

                let nx = noiseCord(
                        x + params.getValue(NoiseGenProperty.OFFSET_X),
                        this.width,
                        whiteNoiseMultiplyer
                    ),
                    ny = noiseCord(
                        z + params.getValue(NoiseGenProperty.OFFSET_Z),
                        this.height,
                        whiteNoiseMultiplyer
                    );
                    


                let val =
                    (this.perl(nxx, nyy) / this.wht(nx, ny)) *
                        Math.E *
                        (Math.log(
                            params.getValue(NoiseGenProperty.HEIGHT_FUNC)
                        ) *
                            params.getValue(NoiseGenProperty.HEIGHT_POSITION)) -
                    params.getValue(NoiseGenProperty.HEIGHT_OFFSET);

                map[z][x] = Math.floor(val * 10);
            }
        }
        return map;
    }
}
