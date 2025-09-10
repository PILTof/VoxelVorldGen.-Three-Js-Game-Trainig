import { World } from "oimo/src/Oimo";
import {
    BoxGeometry,
    Matrix4,
    Object3D,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import GUI from "lil-gui";
import GrassMeshGenerator from "./factories/blocks/GrassMaterialsFactory";
import { OrbitControls, SimplexNoise } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
import SimpleGen from "./worldgen/SimpleGen";
import GrassMaterialsFactory from "./factories/blocks/GrassMaterialsFactory";


export default async function () {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    let chunkScale = 50;

    camera.position.z = chunkScale + 100;
    camera.position.y = chunkScale / 2;
    camera.position.x = chunkScale / 2;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(chunkScale / 2, 5, chunkScale / 2);
    controls.update();

    camera.aspect =
        renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    camera.updateProjectionMatrix();

   
    SimpleGen(scene, chunkScale);


    function animate() {
        //   cube.rotation.x += 0.01;
        //   cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
}
