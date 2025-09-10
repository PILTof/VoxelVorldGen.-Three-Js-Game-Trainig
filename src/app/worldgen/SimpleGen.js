import {
    DirectionalLight,
    Mesh,
    Scene,
} from "three";
import Chunk from "./Chunk";

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
export default async function (scene, cellSize) {

    return new Promise(() => {
        addLight(-1, 2, 4, scene);
        let positionX = 0;
        let i = 1;
        let seed = Math.random();
        for (let i = -2; i < 1; i++) {
            const chunk = new Chunk(cellSize);
            
            chunk.generate(positionX).then((mesh) => {
                mesh.position.x = positionX;
                positionX = (cellSize * i)
                scene.add(mesh);
            });
            chunk.noiseMap.setOffset(cellSize * i, 0)
        }
    })

}
