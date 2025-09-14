import {
    AxesHelper,
    BoxGeometry,
    GridHelper,
    Group,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer,
} from "three";
import { OrbitControls, SimplexNoise } from "three/examples/jsm/Addons.js";
import World from "./worldgen/mesh/World";
import WorldParams from "./worldgen/mesh/WorldParams";
import BlockRegistries from "./worldgen/mesh/InstanceRegistry";
import GUI from "lil-gui";

export default async function () {
    // scene and camera
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

    let chunkScale = 1;

    camera.position.z = chunkScale + 100;
    camera.position.y = chunkScale / 2;
    camera.position.x = chunkScale / 2;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(chunkScale / 2, 5, chunkScale / 2);
    controls.update();

    camera.aspect =
        renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    camera.updateProjectionMatrix();

    // grid
    let gridHelper = new GridHelper(16, 16);
    scene.add(gridHelper);

    let axesHelper = new AxesHelper(10);
    axesHelper.setColors("red", "yellow", "green");
    scene.add(axesHelper);

    let worldParams = new WorldParams().fillValues({
        [WorldParams.GEN_RADIUS]: 5,
    });

    let world = new World(worldParams);
    world.generate();

    scene.add(world);
    // cube
    // let loader = new TextureLoader;

    // let matrix = new Matrix4;

    // let cubeGroup = new Group();
    // let cubeGeometery = new BoxGeometry(1, 1, 1);
    // let cubeMaterial = new MeshBasicMaterial({
    //     map: await loader.loadAsync('/assets/images/textures/block/grass_block_side.png')
    // })

    // let maxCunt = 2;

    // let cubeInstance = new InstancedMesh(cubeGeometery, cubeMaterial, maxCunt);
    // cubeInstance.count = 0;

    // matrix.setPosition(new Vector3(0.5, 0.5,0.5));
    // cubeInstance.setMatrixAt(0, matrix)
    // cubeInstance.count = 1;

    // matrix.setPosition(new Vector3(1.5, 1.5, 1.5));
    // cubeInstance.setMatrixAt(1, matrix);
    // cubeInstance.count = 2;

    // cubeGroup.add(cubeInstance);

    // scene.add(cubeGroup);

    // ChunkDebugger(renderer, camera, scene);

    function animate() {
        //   cube.rotation.x += 0.01;
        //   cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
}
