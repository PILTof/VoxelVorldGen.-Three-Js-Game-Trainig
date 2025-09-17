import { BoxGeometry, MeshBasicMaterial, NearestFilter, TextureLoader } from "three";
import BlockInstance from "../../../ship/Abstract/BlockInstance";

export default class GrassInstance extends BlockInstance {

    instanceId = 0;

    loader = new TextureLoader();
    srcs = [
        "/assets/images/textures/block/grass_block_side.png",
        "/assets/images/textures/block/grass_block_side.png",
        "/assets/images/textures/block/grass_block_top.png",
        "/assets/images/textures/block/dirt.png",
        "/assets/images/textures/block/grass_block_side.png",
        "/assets/images/textures/block/grass_block_side.png",
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

        if (map.src.includes('grass_block_top')) {
            params.color = "#c2d8a9";
        }
        
        return new MeshBasicMaterial(params);
    });

    constructor(maxCount) {
        super(maxCount);
        this.init();
    }
}
