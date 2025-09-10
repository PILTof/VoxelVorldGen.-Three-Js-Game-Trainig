import { DirectionalLight, Mesh, Scene } from "three";
import Chunk from "./Chunk";
import NoiseGenProperty from "./types/NoiseGenProperty";
import GUI from "lil-gui";

function addLight(x, y, z, scene) {
    const color = 0xffffff;
    const intensity = 3;
    const light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
}

/**
 *
 * @param {Mesh} SrouceOjbect
 * @param {Scene} scene
 */
export default function (scene, cellSize) {
    return new Promise(() => {
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

        params
            .setValue(NoiseGenProperty.CHUNK_SCALE, cellSize)
            .setValue(NoiseGenProperty.HEIGHT_OFFSET, 23)
            .setValue(NoiseGenProperty.HEIGHT_FUNC, 16)
            .setValue(NoiseGenProperty.HEIGHT_POSITION, 3.4);

        let genRadius = 16;

        for (let x = -1 * genRadius; x < genRadius; x++) {
            for (let z = -1 * genRadius; z < genRadius; z++) {
                const chunk = new Chunk(cellSize, seed);
                params.fillValues({
                    offsetX: cellSize * x,
                    offsetZ: cellSize * z,
                });
                chunk.generate(params).then(
                    /**
                     *
                     * @param {Mesh} mesh
                     */
                    (mesh) => {
                        mesh.position.x = cellSize * x;
                        mesh.position.z = cellSize * z;
                        scene.add(mesh);
                        
                    }
                );
                chunk.noiseMap.setOffset(cellSize * x, 0);
            }
        }
    });
}
