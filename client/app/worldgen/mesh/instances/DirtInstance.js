import { MeshBasicMaterial, TextureLoader } from "three";
import BlockInstance from "../../../ship/Abstract/BlockInstance";

export default class DirtInstance extends BlockInstance {
    instanceId = 1;
    loader = new TextureLoader();
    srcs = [
        "/assets/images/textures/block/dirt.png",
        "/assets/images/textures/block/dirt.png",
        "/assets/images/textures/block/dirt2.png",
        "/assets/images/textures/block/dirt3.png",
        "/assets/images/textures/block/dirt.png",
        "/assets/images/textures/block/dirt.png",
    ];
    textures = this.srcs.map((src) => {
        return {
            src: src,
            texture: this.loader.load(src),
        };
    });
    material = this.textures.map((map) => {
        let params = {
            map: map.texture,
        };
        return new MeshBasicMaterial(params);
    });

    constructor(maxCount) {
        super(maxCount);
        this.init();
    }
}
