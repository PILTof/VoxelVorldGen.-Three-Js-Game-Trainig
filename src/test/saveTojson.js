import {
    BoxGeometry,
    DirectionalLight,
    DoubleSide,
    FileLoader,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    ObjectLoader,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import io from "socket.io-client";
import axios from "axios";
import { MeshLambertMaterial } from "three/webgpu";

export default async function () {
    let socket = io("http://localhost:3000");

    axios.defaults.baseURL = "http://localhost:3000"

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

    const color = 0xffffff;
    const intensity = 3;
    const light = new DirectionalLight(color, intensity);
    light.position.set(4, 4, 4);
    scene.add(light);

    let chunkScale = 1;

    camera.position.z = chunkScale + 4;
    camera.position.y = chunkScale / 2;
    camera.position.x = chunkScale / 2;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    camera.aspect =
        renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    camera.updateProjectionMatrix();

    let cords = [0, 0, 0];

    let chunkName = cords.join("_");

    let response = await axios.post("/world/chunk/", {
        name: chunkName,
    });

    if (
        response.data?.status == "exist"
    ) {
        let objectData = response.data.data;
        let loader = new ObjectLoader();
        console.log(objectData);
        let geometry = loader.parseGeometries(objectData.geometries);
        console.log(geometry);
        let textureLoader = new TextureLoader();
        let texture = textureLoader.load(
            "/assets/images/textures/block/grass_block_side.png"
        );
        let material = new MeshLambertMaterial({
            map: texture,
            side: DoubleSide,
            alphaTest: 0.1,
            transparent: true,
        });
        let mesh = new Mesh(geometry[Object.keys(geometry).at(0)], material);
        scene.add(mesh);
    } else {
        let geometry = new BoxGeometry(1, 1, 1);
        let loader = new TextureLoader();
        let texture = loader.load(
            "/assets/images/textures/block/grass_block_side.png"
        );
        // texture.magFilter = NearestFilter;
        // texture.minFilter = NearestFilter;
        let material = new MeshLambertMaterial({
            map: texture,
            side: DoubleSide,
            alphaTest: 0.1,
            transparent: true,
        });

        let mesh = new Mesh(geometry, material);
        scene.add(mesh);

        mesh.name = chunkName;

        let saved = mesh.toJSON();
        socket.emit("chunk created", saved);
    }

    socket.on("log", (resp) => {
        console.log(resp);
    });

    function animate() {
        //   cube.rotation.x += 0.01;
        //   cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
}
