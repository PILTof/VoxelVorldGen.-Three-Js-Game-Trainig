import * as THREE from "three";
import NoiseMap from "./NoiseMap";

export default class ChunkGeometryData {
    constructor(options) {
        this.maxHeight = options.maxHeight;
        this.cellSize = options.cellSize;
        this.tileSize = options.tileSize;
        this.tileTextureWidth = options.tileTextureWidth;
        this.tileTextureHeight = options.tileTextureHeight;
        const { cellSize } = this;
        this.cellSliceSize = cellSize * cellSize;
        this.cell = new Uint8Array(cellSize * this.maxHeight * cellSize);
        this.noiseGen = new NoiseMap(0, 0, options.noiseSeed);
    }
    noiseOffsetX = 0;
    noiseOffsetZ = 0;
    setNoiseOffset(x, z) {
        this.noiseOffsetX = x;
        this.noiseOffsetZ = z;
    }
    computeVoxelOffset(x, y, z) {
        const { cellSize, cellSliceSize } = this;
        const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
        const voxelY = THREE.MathUtils.euclideanModulo(y, this.maxHeight) | 0;
        const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
        return voxelY * cellSliceSize + voxelZ * cellSize + voxelX;
    }
    getCellForVoxel(x, y, z) {
        const { cellSize } = this;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / this.maxHeight);
        const cellZ = Math.floor(z / cellSize);
        if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
            return null;
        }

        return this.cell;
    }
    setVoxel(x, y, z, v) {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return; // TODO: add a new cell?
        }

        const voxelOffset = this.computeVoxelOffset(x, y, z);
        cell[voxelOffset] = v;
    }
    getVoxel(x, y, z) {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return 0;
        }

        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return cell[voxelOffset];
    }
    generateGeometryDataForCell(cellX, cellY, cellZ) {
        const { cellSize, tileSize, tileTextureWidth, tileTextureHeight } =
            this;
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const startX = cellX * cellSize;
        const startY = cellY * cellSize;
        const startZ = cellZ * cellSize;
        let values = [];

        for (let y = 0; y < this.maxHeight; ++y) {
            const voxelY = startY + y;
            for (let z = 0; z < cellSize; ++z) {
                const voxelZ = startZ + z;
                for (let x = 0; x < cellSize; ++x) {
                    const voxelX = startX + x;
                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        // voxel 0 is sky (empty) so for UVs we start at 0
                        const uvVoxel = voxel - 1;
                        let textureX;
                        // There is a voxel here but do we need faces for it?
                        if (voxelY < 23) {
                            let nx = (voxelX + this.noiseOffsetX) / cellSize,
                                nz = (voxelZ + this.noiseOffsetZ) / cellSize;

                            textureX = this.noiseGen.wht(nx, nz) * Math.log(10) - 1.4;
                        }

                        for (const {
                            dir,
                            corners,
                            uvRow,
                        } of ChunkGeometryData.faces) {
                            const neighbor = this.getVoxel(
                                voxelX + dir[0],
                                voxelY + dir[1],
                                voxelZ + dir[2]
                            );
                            if (!neighbor) {
                                // this voxel has no neighbor in this direction so we need a face.
                                const ndx = positions.length / 3;
                                for (const { pos, uv } of corners) {
                                    positions.push(
                                        pos[0] + x,
                                        pos[1] + y,
                                        pos[2] + z
                                    );
                                    normals.push(...dir);
                                    let uvx, uvy;
                                    
                                    /**
                                     * old
                                     */
                                    // uvs.push(
                                    //    ((uvVoxel + uv[0]) * tileSize) /
                                    //             tileTextureWidth,
                                    //     1 -
                                    //         ((uvRow + 1 - uv[1]) * tileSize) /
                                    //             tileTextureHeight
                                    // );



                                    /**
                                     * меняет UV в зависимости от карты шума. 
                                     * Т.е. - поумолчанию - везде трава,
                                     * но если если есть шум > 1, то будет песок.
                                     * 
                                     * Делалось чисто для тестов.
                                     */
                                     // 0, 1, 2, 3, 4, max: 80 / 16 = 4                                    
                                    let blockSelector = 0;
                                    // if (textureX && textureX > 1) {
                                    //     // 1.2, 7.2, 0.125
                                    //     blockSelector = 2;
                                    // }


                                    uvx = uv[0] + blockSelector;
                                    uvy = uvRow + 1 - uv[1];
                                    uvs.push(
                                        (uvx * tileSize) / tileTextureWidth,
                                        1 - (uvy * tileSize) / tileTextureHeight
                                    )

                                }

                                indices.push(
                                    ndx,
                                    ndx + 1,
                                    ndx + 2,
                                    ndx + 2,
                                    ndx + 1,
                                    ndx + 3
                                );
                            }
                        }
                    }
                }
            }
        }
        return {
            positions,
            normals,
            uvs,
            indices,
        };
    }
}

ChunkGeometryData.faces = [
    {
        // left`
        uvRow: 2,
        dir: [-1, 0, 0],
        corners: [
            { pos: [0, 1, 0], uv: [0, 1] },
            { pos: [0, 0, 0], uv: [0, 0] },
            { pos: [0, 1, 1], uv: [1, 1] },
            { pos: [0, 0, 1], uv: [1, 0] },
        ],
    },
    {
        // right
        uvRow: 2,
        dir: [1, 0, 0],
        corners: [
            { pos: [1, 1, 1], uv: [0, 1] },
            { pos: [1, 0, 1], uv: [0, 0] },
            { pos: [1, 1, 0], uv: [1, 1] },
            { pos: [1, 0, 0], uv: [1, 0] },
        ],
    },
    {
        // bottom
        uvRow: 1,
        dir: [0, -1, 0],
        corners: [
            { pos: [1, 0, 1], uv: [1, 0] },
            { pos: [0, 0, 1], uv: [0, 0] },
            { pos: [1, 0, 0], uv: [1, 1] },
            { pos: [0, 0, 0], uv: [0, 1] },
        ],
    },
    {
        // top
        uvRow: 0,
        dir: [0, 1, 0],
        corners: [
            { pos: [0, 1, 1], uv: [1, 1] },
            { pos: [1, 1, 1], uv: [0, 1] },
            { pos: [0, 1, 0], uv: [1, 0] },
            { pos: [1, 1, 0], uv: [0, 0] },
        ],
    },
    {
        // back
        uvRow: 2,
        dir: [0, 0, -1],
        corners: [
            { pos: [1, 0, 0], uv: [0, 0] },
            { pos: [0, 0, 0], uv: [1, 0] },
            { pos: [1, 1, 0], uv: [0, 1] },
            { pos: [0, 1, 0], uv: [1, 1] },
        ],
    },
    {
        // front
        uvRow: 2,
        dir: [0, 0, 1],
        corners: [
            { pos: [0, 0, 1], uv: [0, 0] },
            { pos: [1, 0, 1], uv: [1, 0] },
            { pos: [0, 1, 1], uv: [0, 1] },
            { pos: [1, 1, 1], uv: [1, 1] },
        ],
    },
];
