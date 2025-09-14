import { Group, Matrix4 } from "three";
import BlockRegistries from "./InstanceRegistry";
import HeightMapClass from "../noise/HeightMapClass";
import HeightMapParams from "../noise/HeightMapParams";

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

    generate(offsetX = 0, offsetZ = 0) {



        let heightMap = this.heightMapClass.generate(
            this.heightMapParams.fillValues({
                [HeightMapParams.OFFSET_X] : offsetX,
                [HeightMapParams.OFFSET_Z] : offsetZ
            })
        )

        let grassBlock = BlockRegistries.GRASS;
        let dirtBlock = BlockRegistries.DIRT;
        let matrix = new Matrix4;

        for (let z = 0; z < heightMap.length; z++) {
            const xses = heightMap[z];
            for (let x = 0; x < xses.length; x++) {
                const y = xses[x];
                


                matrix.setPosition(x + 0.5 + offsetX, y + 0.5, z + 0.5 + offsetZ);
                grassBlock.setMatrixAt(grassBlock.count, matrix);
                grassBlock.count++;
                this.add(grassBlock)

                for (let yy = 0; yy < y - 1; yy++) {
                    
                    matrix.setPosition(x + 0.5 + offsetX, 0.5 + yy, z + 0.5 + offsetZ);
                    dirtBlock.setMatrixAt(dirtBlock.count, matrix);
                    dirtBlock.count++;
                    this.add(dirtBlock);
                    
                }
            }
            
        }


    }
}
