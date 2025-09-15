import { Vector2 } from "three";
import { FBM, Perlin } from "three-noise";
import HeightMapParams from "./HeightMapParams";

export default class HeightMapClass {
    scale = 1500;
    height = this.scale;
    width = this.scale;
    multiplyerPerl = 4;
    multiplyerNoiseSelect = 10;
    /**
     * @type {Perlin}
     */
    perlinGen = null;

    /**
     * @type {FBM}
     */
    whiteGen = null;

    // randomPoints([width, height], nPoints, margin = 0) {
    //     let result = [];
    //     for (let i = 0; i < nPoints; i++) {
    //         result.push({
    //             x: randInt(margin, width - margin),
    //             y: randInt(margin, height - margin),
    //         });
    //     }
    //     return result;
    // }

    constructor(seed, mltSeed, scale) {
        this.scale = scale;
        this.width = scale;
        this.height = scale;

        this.perlinGen = new Perlin(seed);
        this.whiteGen = new FBM({
            seed: seed,
        });
        this.whiteMultiplyerGen = new FBM({
            seed: mltSeed,
        });
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

    /**
     * Генерирует чанк через три карты шума:
     * отноешние карты шума перлинга(1) к (карта шума(2) с мультплаеров зависящим от независимой карты шума(3))
     * @param {HeightMapParams} params
     * @returns
     */
    generate(params = new HeightMapParams()) {
        let noiseCord = (cord, side, mlt) => {
            return (cord / side) * mlt + 10;
        };
        let map = [];
        for (let z = 0; z < params.getValue(HeightMapParams.CHUNK_SCALE); z++) {
            map[z] = [];
            for (
                let x = 0;
                x < params.getValue(HeightMapParams.CHUNK_SCALE);
                x++
            ) {
                let nxxx = noiseCord(
                        x + params.getValue(HeightMapParams.OFFSET_X),
                        this.width,
                        this.multiplyerNoiseSelect
                    ),
                    nyyy = noiseCord(
                        z + params.getValue(HeightMapParams.OFFSET_Z),
                        this.height,
                        this.multiplyerNoiseSelect
                    );

                let whiteNoiseMultiplyer = this.mltWhiteNoise(nxxx, nyyy);

                let nxx = noiseCord(
                        x + params.getValue(HeightMapParams.OFFSET_X),
                        this.width,
                        this.multiplyerPerl
                    ),
                    nyy = noiseCord(
                        z + params.getValue(HeightMapParams.OFFSET_Z),
                        this.height,
                        this.multiplyerPerl
                    );

                let nx = noiseCord(
                        x + params.getValue(HeightMapParams.OFFSET_X),
                        this.width,
                        whiteNoiseMultiplyer
                    ),
                    ny = noiseCord(
                        z + params.getValue(HeightMapParams.OFFSET_Z),
                        this.height,
                        whiteNoiseMultiplyer
                    );

                let val =
                    (this.perl(nxx, nyy) / this.wht(nx, ny)) *
                        Math.E *
                        (Math.log(params.getValue(HeightMapParams.LOG_VALUE)) *
                            params.getValue(
                                HeightMapParams.HEIGHT_MULTIPLYER_VALUE
                            )) -
                    params.getValue(HeightMapParams.HEIGHT_OFFSET_VALUE);

                map[z][x] = Math.floor(val * 10);
            }
        }
        return map;
    }
}
