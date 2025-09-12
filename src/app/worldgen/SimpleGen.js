import {
    BufferGeometry,
    DirectionalLight,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    Scene,
    TextureLoader,
    Vector2,
} from "three";
import ChunkGeometery from "./ChunkGeometry";
import NoiseGenProperty from "./types/NoiseGenProperty";
import GUI from "lil-gui";

function addLight(x, y, z, scene) {
    const color = 0xffffff;
    const intensity = 3;
    const light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
}

async function getTextureMaterials(arrTextures) {
    return new Promise(async (resolve, reject) => {
        let loader = new TextureLoader();

        let result = [];
        let textureProperties = { height: 16, width: 0 };
        for (let index = 0; index < arrTextures.length; index++) {
            const path = arrTextures[index];
            let texture = await loader.loadAsync(path);
            texture.offset = new Vector2(0, 0);
            textureProperties.width += texture.image.width;
            // let material = new MeshLambertMaterial({
            //     map: texture,
            //     side: DoubleSide,
            //     alphaTest: 0.1,
            //     transparent: true,
            // });
            result.push(
                new MeshLambertMaterial({
                    map: texture,
                    side: DoubleSide,
                    alphaTest: 0.1,
                    // transparent: true,
                })
            );
        }
        resolve([result, textureProperties]);
    });
}

/**
 *
 * @param {Mesh} SrouceOjbect
 * @param {Scene} scene
 */
export default function (scene, cellSize) {
    return new Promise(async () => {
        addLight(-1, 2, 4, scene);
        let i = 1;
        let seed = 0.7718833059915047;

        // let seed = 0.4991262724525426;
        // let seed = 0.658035728047329;
        // let seed = Math.random();
        let guiInfo = {
            seed: seed,
        };
        let gui = new GUI();
        gui.add(guiInfo, "seed").setValue(seed);

        gui.domElement.style.marginTop = "200px";

        let params = new NoiseGenProperty();

        let [materials, textureProperties] = await getTextureMaterials([
            "/assets/images/textures/block/grass_block_top.png",
            // "/assets/images/textures/block/grass_block_side.png",
            // "/assets/images/textures/block/grass_block_side.png",
            // "/assets/images/textures/block/grass_block_side.png",
            // "/assets/images/textures/block/grass_block_side.png",
        ]);
        params
            .setValue(NoiseGenProperty.CHUNK_SCALE, cellSize)
            .setValue(NoiseGenProperty.HEIGHT_OFFSET, 23)
            .setValue(NoiseGenProperty.HEIGHT_FUNC, 16)
            .setValue(NoiseGenProperty.HEIGHT_POSITION, 3.4);

        let genRadius = 8;

        for (let x = -1 * genRadius; x < genRadius; x++) {
            for (let z = -1 * genRadius; z < genRadius; z++) {
                const chunkGeometry = new ChunkGeometery();
                await chunkGeometry.init(cellSize, seed, [
                    // textureProperties.width,
                    // textureProperties.height,
                    16,16                    
                ]);
                params.fillValues({
                    offsetX: cellSize * x,
                    offsetZ: cellSize * z,
                });
                chunkGeometry.generate(params).then(
                    /**
                     *
                     * @param {BufferGeometry} mesh
                     */
                    (geometry) => {
                        let mesh = new Mesh(geometry, materials[0]);
                        mesh.position.x = cellSize * x;
                        mesh.position.z = cellSize * z;
                        scene.add(mesh);
                    }
                );
                chunkGeometry.noiseMap.setOffset(cellSize * x, 0);
            }
        }
    });
}
