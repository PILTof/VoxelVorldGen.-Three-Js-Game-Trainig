import GUI from "lil-gui";
import { ArrowHelper, PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";
import { Vector2, Vector3 } from "three/webgpu";

/**
 * 
 * @param {WebGLRenderer} renderer 
 * @param {PerspectiveCamera} camera
 * @param {Scene} scene
 */
export default function (renderer, camera, scene) {
    let mouse = new Vector2();
    let raycaster = new Raycaster();
    const arrowHelper = new ArrowHelper(new Vector3, new Vector3, 0.25, 0xffff00)
    scene.add(arrowHelper)

    let gui = new GUI;
    let info = {
        coords: 'nan' 
    }
    let property = gui.add(info, 'coords');
    property.setValue('test')

    document.addEventListener(
        "mousemove",
        /**
         *
         * @param {MouseEvent} mouseEevnt
         */
        (event) => {
            mouse.set((event.clientX / renderer.domElement.clientWidth ) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, camera)
            let intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                const n = new Vector3;
                if(intersects[0]?.face?.normal){
                    n.copy(intersects[0]?.face?.normal)
                }
                n.transformDirection(intersects[0].object.matrixWorld)

                let point = intersects[0].point;

                property.setValue(`${Math.round(point.x)}, ${Math.round(point.y)}, ${Math.round(point.z)}`)
                arrowHelper.setDirection(n);
                arrowHelper.position.copy(intersects[0].point);
            }
        }
    );
}
