import {
    BufferAttribute,
    BufferGeometry, NearestFilter,
    SRGBColorSpace,
    Texture
} from "three";
import ChunkGeometryData from "./ChunkGeometryData";
import NoiseMap from "./NoiseMap";
import NoiseGenProperty from "./types/NoiseGenProperty";

class ChunkGeometery {
    /**
     * @type {Texture}
     */
    texture = null;

    tileSize = 16;

    /**
     * @type {ChunkGeometryData}
     */
    chunkGeometryData = null;
    /**
     * @type {NoiseMap}
     */
    noiseMap = null;
    heightMap = [];

    constructor() {}
    

    async init(cellSize, seed, [tWidth, tHeight]) {
        this.seed = seed;
        this.cellSize = cellSize;

        this.noiseMap = new NoiseMap(0, 0, seed);

        this.chunkGeometryData = new ChunkGeometryData({
            cellSize: this.cellSize,
            tileSize: this.tileSize,
            tileTextureWidth: tWidth,
            tileTextureHeight: tHeight,
            maxHeight: 256,
            noiseSeed: seed,
        });
    }

    /**
     *
     * @param {NoiseGenProperty} p
     * @returns {BufferGeometry}
     */
    generate(p) {
        return new Promise((resolve, reject) => {
            this.heightMap = this.noiseMap.generate(p);
            this.chunkGeometryData.setNoiseOffset(
                p.getValue(NoiseGenProperty.OFFSET_X),
                p.getValue(NoiseGenProperty.OFFSET_Z)
            );

            for (const z in this.heightMap) {
                if (Object.prototype.hasOwnProperty.call(this.heightMap, z)) {
                    const heights = this.heightMap[z];
                    for (const x in heights) {
                        if (Object.prototype.hasOwnProperty.call(heights, x)) {
                            const y = heights[x];
                            if (y > 1) {
                                for (let yy = y; yy > 0; yy--) {
                                    this.chunkGeometryData.setVoxel(x, yy, z, y);
                                }
                            } else {
                                this.chunkGeometryData.setVoxel(x, y, z, y);
                            }
                        }
                    }
                }
            }
            const { positions, normals, uvs, indices } =
                this.chunkGeometryData.generateGeometryDataForCell(0, 0, 0);

            const geometry = new BufferGeometry();

            geometry.setAttribute(
                "position",
                new BufferAttribute(new Float32Array(positions), 3)
            );
            geometry.setAttribute(
                "normal",
                new BufferAttribute(new Float32Array(normals), 3)
            );
            geometry.setAttribute(
                "uv",
                new BufferAttribute(new Float32Array(uvs), 2)
            );
            geometry.setIndex(indices);
            resolve(geometry);
        });
    }
}

export default ChunkGeometery;
