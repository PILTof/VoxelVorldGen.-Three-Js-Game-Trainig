import { BoxGeometry, InstancedMesh, MeshBasicMaterial, NearestFilter } from "three";

/**
 * @abstract
 */
export default class BlockInstance extends InstancedMesh {

    material = [
        // right
        new MeshBasicMaterial({
            color: "red",
        }),
        // left
        new MeshBasicMaterial({
            color: "red",
        }),
        // up
        new MeshBasicMaterial({
            color: "yellow",
        }),
        //bottom
        new MeshBasicMaterial({
            color: "yellow",
        }),
        // front
        new MeshBasicMaterial({
            color: "green",
        }),
        // back
        new MeshBasicMaterial({
            color: "green",
        }),
    ];

    constructor(maxCount) {
        let geometry = new BoxGeometry(1, 1, 1);
        let baseMaterial = new MeshBasicMaterial({ color: "green" });
        super(geometry, baseMaterial, maxCount);
        this.count = 0;
    }

    init()
    {
        this.textures.map(map => {
            map.texture.minFilter = NearestFilter;
            map.texture.magFilter = NearestFilter;
        })
        this.count = 0;
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
        return this;
    }

    getInstanceId()
    {
        return this.instanceId;
    }
}
