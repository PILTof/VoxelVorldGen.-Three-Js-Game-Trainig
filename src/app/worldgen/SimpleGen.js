import { DirectionalLight, Mesh, Scene } from "three";
import Chunk from "./Chunk";
import NoiseGenProperty from "./types/NoiseGenProperty";

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
        let seed = Math.random();
        let params = new NoiseGenProperty();
        params.setValue('chunkScale', 50)
        params.setValue('heightOffset', 11.3)

        let genRadius = 5;

        for (let x = -1 * genRadius; x < genRadius; x++) {
            for (let z = -1 * genRadius; z < genRadius; z++) {
                const chunk = new Chunk(cellSize);
                params.fillValues({
                    offsetX: cellSize * x,
                    offsetZ: cellSize * z
                });
                chunk.generate(params).then((mesh) => {
                    mesh.position.x = cellSize * x;
                    mesh.position.z = cellSize * z;
                    scene.add(mesh);
                });
                chunk.noiseMap.setOffset(cellSize * x, 0);
            }
        }
    });
}
