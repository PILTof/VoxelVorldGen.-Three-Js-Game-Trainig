import {
    BufferAttribute,
    BufferGeometry,
    DoubleSide,
    Mesh,
    MeshLambertMaterial,
    NearestFilter,
    SRGBColorSpace,
    Texture,
    TextureLoader,
} from "three";
import ChunkGeometry from "./ChunkGeometry";
import NoiseMap from "./NoiseMap";
import { SimplexNoise } from "three/examples/jsm/Addons.js";
import NoiseGenProperty from "./types/NoiseGenProperty";

class Chunk {
    /**
     * @type {Texture}
     */
    texture = null;

    tileSize = 16;
    tileTextureWidth = 256;
    tileTextureHeight = 64;

    /**
     * @type {ChunkGeometry}
     */
    world = null;
    /**
     * @type {NoiseMap}
     */
    noiseMap = null;
    heightMap = [];

    constructor(cellSize, seed) {
        let loader = new TextureLoader();

        this.cellSize = cellSize;
        this.texture = loader.load(
            "https://threejs.org/manual/examples/resources/images/minecraft/flourish-cc-by-nc-sa.png"
        );
        this.texture.magFilter = NearestFilter;
        this.texture.minFilter = NearestFilter;
        this.texture.colorSpace = SRGBColorSpace;

        this.noiseMap = new NoiseMap(0, 0, seed);

        this.world = new ChunkGeometry({
            cellSize: this.cellSize,
            tileSize: this.tileSize,
            tileTextureWidth: this.tileTextureWidth,
            tileTextureHeight: this.tileTextureHeight,
            maxHeight: 256
        });
    }

    generate(p ) {
        return new Promise((resolve, reject) => {
            this.heightMap = this.noiseMap.generate(p);

            for (const z in this.heightMap) {
                if (Object.prototype.hasOwnProperty.call(this.heightMap, z)) {
                    const heights = this.heightMap[z];
                    for (const x in heights) {
                        if (Object.prototype.hasOwnProperty.call(heights, x)) {
                            const y = heights[x];
                            if ( y > 1) {
                                for (let yy = y; yy > 0; yy--) {
                                    this.world.setVoxel(x, yy, z, y);
                                }
                            } else {
                                this.world.setVoxel(x, y, z, y);

                            }
                        }
                    }
                }
            }
            const { positions, normals, uvs, indices } =
                this.world.generateGeometryDataForCell(0, 0, 0);

            const geometry = new BufferGeometry();
            const material = new MeshLambertMaterial({
                map: this.texture,
                side: DoubleSide,
                alphaTest: 0.1,
                transparent: true,
            });

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
            resolve(new Mesh(geometry, material));
        });
    }
}

export default Chunk;
