import { Group, Matrix4 } from "three";
import BlockRegistries from "./InstanceRegistry";
import HeightMapClass from "../noise/HeightMapClass";
import HeightMapParams from "../noise/HeightMapParams";
import BlockInstance from "../../ship/Abstract/BlockInstance";

export default class Chunk extends Group {
    /**
     * @type {HeightMapClass}
     */
    heightMapClass = {};
    /**
     * @type {HeightMapParams}
     */
    heightMapParams = {};

    /**
     *
     * @param {HeightMapClass} heightMapClass
     * @param {HeightMapParams} heightMapParams
     */
    constructor(heightMapClass, heightMapParams) {
        super();
        this.heightMapClass = heightMapClass;
        this.heightMapParams = heightMapParams;
    }

    /**
     *
     * @param {*} x
     * @param {*} y
     * @param {*} z
     * @param {typeof BlockInstance} instance
     */
    setBlock(x, y, z, instance) {
        let matrix = new Matrix4();
        matrix.setPosition(x, y, z);
        instance.setMatrixAt(instance.count, matrix);
        instance.count++;
        this.add(instance);
    }

    generate(offsetX = 0, offsetZ = 0) {
        let heightMap = this.heightMapClass.generate(
            this.heightMapParams.fillValues({
                [HeightMapParams.OFFSET_X]: offsetX,
                [HeightMapParams.OFFSET_Z]: offsetZ,
            })
        );

        for (let z = 0; z < heightMap.length; z++) {
            const xses = heightMap[z];
            for (let x = 0; x < xses.length; x++) {
                const y = xses[x];

                this.setBlock(
                    x + 0.5 + offsetX,
                    y + 0.5,
                    z + offsetZ + 0.5,
                    BlockRegistries.GRASS
                );

                for (let yy = 0; yy < y - 1; yy++) {
                    this.setBlock(
                        x + 0.5 + offsetX,
                        0.5 + yy,
                        z + 0.5 + offsetZ,
                        BlockRegistries.DIRT
                    );
                }
            }
        }
    }
}
