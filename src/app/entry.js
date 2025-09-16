import {
    AxesHelper,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls, SimplexNoise } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";


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

    let chunkScale = 4;

    camera.position.z = 0
    camera.position.y = chunkScale / 2;
    camera.position.x = 0
    camera.rotation.x -= degToRad(45);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    camera.aspect =
        renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    camera.updateProjectionMatrix();


    const gridHelper = new GridHelper(50, 50);
    scene.add(gridHelper);

    const axesHelper = new AxesHelper(50);
    axesHelper.setColors('red', 'yellow', 'lime');
    scene.add(axesHelper);


   
    function animate() {
        //   cube.rotation.x += 0.01;
        //   cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
}
