import { Group } from "three";
import WorldParams from "./WorldParams";
import Chunk from "./Chunk";
import HeightMapClass from "../noise/HeightMapClass";
import HeightMapParams from "../noise/HeightMapParams";


export default class World extends Group {
    /**
     * @type {WorldParams}
     */
    params = {};

    constructor(params = new WorldParams()) {
        super();
        this.params = params;
    }

    saveData() {}

    generate() {
        this.clear();

        const heightMapClass = new HeightMapClass(
            Math.random(),
            Math.random(),
            1500
        );

        let chunk = new Chunk(
            heightMapClass,
            new HeightMapParams().fillValues({
                [HeightMapParams.CHUNK_SCALE]: 16,
                [HeightMapParams.LOG_VALUE]: 50,
                [HeightMapParams.HEIGHT_OFFSET_VALUE]: 8,
                [HeightMapParams.HEIGHT_MULTIPLYER_VALUE]: 1,
            })
        );
        for (
            let x = -1 * this.params.getValue(WorldParams.GEN_RADIUS);
            x < this.params.getValue(WorldParams.GEN_RADIUS);
            x++
        ) {
            for (
                let z = -1 * this.params.getValue(WorldParams.GEN_RADIUS);
                z < this.params.getValue(WorldParams.GEN_RADIUS);
                z++
            ) {
                chunk.generate(x * 16, z * 16);
            }
        }
        this.add(chunk);
    }
}
