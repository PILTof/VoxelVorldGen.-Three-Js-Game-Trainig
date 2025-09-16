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
            0.213245456,
            0.213245456 * 2,
            1500
        );

        let chunks = new Chunk(
            heightMapClass,
            new HeightMapParams().fillValues({
                [HeightMapParams.CHUNK_SCALE]: 16,
                [HeightMapParams.LOG_VALUE]: 40,
                [HeightMapParams.HEIGHT_OFFSET_VALUE]: 12,
                [HeightMapParams.HEIGHT_MULTIPLYER_VALUE]: 1.6,
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
                requestIdleCallback(() => chunks.generate(x * 16, z * 16), {timeout: 1000})
            }
        }
        this.add(chunks);
    }
}
