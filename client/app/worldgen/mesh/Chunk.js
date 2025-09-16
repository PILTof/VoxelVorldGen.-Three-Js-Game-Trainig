import { Group, InstancedMesh, Matrix4 } from "three";
import BlockRegistries, { InstanceRegistry } from "./InstanceRegistry";
import HeightMapClass from "../noise/HeightMapClass";
import HeightMapParams from "../noise/HeightMapParams";
import BlockInstance from "../../ship/Abstract/BlockInstance";
import BlockPositions from "./types/BlockPositions";

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
     * @type {BlockPositions}
     */
    blockPositions = {};

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
     * @param {BlockInstance} instance
     */
    setBlock(x, y, z, instance) {
        let matrix = new Matrix4();
        matrix.setPosition(x, y, z);
        instance.setMatrixAt(instance.count, matrix);
        instance.count++;
        instance.instanceMatrix.needsUpdate = true;
        this.add(instance);
    }

    generateTerrainBlockPositions(offsetX = 0, offsetZ = 0) {
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
                this.blockPositions.addBlockPosition(
                    x + offsetX,
                    y,
                    z + offsetZ,
                    BlockRegistries.GRASS.getInstanceId()
                );
                for (let yy = -20; yy < y - 1; yy++) {
                    this.blockPositions.addBlockPosition(
                        x + offsetX,
                        yy,
                        z + offsetZ,
                        BlockRegistries.DIRT.getInstanceId()
                    );
                }
            }
        }
    }

    generateMeshes() {
        let positions = this.blockPositions.getData();

        for (const x in positions) {
            for (const y in positions[x]) {
                for (const z in positions[x][y]) {
                    let { instanceId, tags } = positions[x][y][z];
                    if (this.isBlockObscured(x, y, z)) {
                        continue;
                    }
                    this.setBlock(
                        x,
                        y,
                        z,
                        InstanceRegistry.getInstanceById(instanceId)
                    );
                }
            }
        }
    }

    generate(offsetX = 0, offsetZ = 0) {
        this.blockPositions = new BlockPositions();

        this.generateTerrainBlockPositions(offsetX, offsetZ);

        this.blockPositions.storeData();
        
        this.generateMeshes();
    }

    isBlockObscured(_x, _y, _z) {
        let x = Number(_x),
            y = Number(_y),
            z = Number(_z);

        const up = this.blockPositions.getBlockAt(x, y + 1, z);
        const down = this.blockPositions.getBlockAt(x, y - 1, z);
        const left = this.blockPositions.getBlockAt(x + 1, y, z);
        const right = this.blockPositions.getBlockAt(x - 1, y, z);
        const forward = this.blockPositions.getBlockAt(x, y, z + 1);
        const back = this.blockPositions.getBlockAt(x, y, z - 1);

        // If any of the block's sides is exposed, it is not obscured
        if (
            up === null ||
            down === null ||
            left === null ||
            right === null ||
            forward === null ||
            back === null
        ) {
            return false;
        } else {
            return true;
        }
    }
}
