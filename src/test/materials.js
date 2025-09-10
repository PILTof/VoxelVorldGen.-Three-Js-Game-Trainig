import {
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    DirectionalLight,
    GridHelper,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GrassMaterialsFactory from "../app/factories/blocks/GrassMaterialsFactory";
import testMeshData from "./testMeshData";

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
function animate() {
    renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);

camera.position.x = 2;
camera.position.y = 1;
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

const grid = new GridHelper(10, 10);
scene.add(grid)

function addCube() {
    let loader = new TextureLoader();

    let geometry = new BufferGeometry();
    geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(testMeshData.positions), 3)
    );
    geometry.setAttribute(
        "normal",
        new BufferAttribute(new Float32Array(testMeshData.normals), 3)
    );
    geometry.setAttribute(
        "uv",
        new BufferAttribute(new Float32Array(testMeshData.uvs), 2)
    );
    

    geometry.setIndex(testMeshData.indexes);

    let textures = [
        loader.load("/assets/images/textures/block/grass_block_top.png"),
        loader.load("/assets/images/textures/block/dirt.png"),
        loader.load("/assets/images/textures/block/grass_block_side.png"),
    ];

    const GrassMaterials = GrassMaterialsFactory({
        top: "/assets/images/textures/block/grass_block_top.png",
        bottom: "/assets/images/textures/block/dirt.png",
        sides: "/assets/images/textures/block/grass_block_side.png",
    });

    let material = new MeshBasicMaterial({
        map: textures[2],
    });

    let mesh = new Mesh(geometry, material);
    scene.add(mesh);
}

function addLight(x, y, z) {
    const color = 0xffffff;
    const intensity = 3;
    const light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
}

export default function () {
    addCube();
    addLight(-1, 2, 4);
}
