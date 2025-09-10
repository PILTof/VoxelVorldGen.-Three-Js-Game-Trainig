import { MeshBasicMaterial, SRGBColorSpace, Texture } from "three";
import { CubeMaterials } from "./CubeMaterialsFactory";

class GrassMaterials extends CubeMaterials {


    /**
     * 
     * @param {Texture} texture 
     * @param {parameters} parameters 
     */
    onAfterSetTexture(texture, parameters)
    {
        texture.colorSpace = SRGBColorSpace;
        return texture;
    }
    /**
     * 
     * @param {MeshBasicMaterial} material 
     * @param {import("three").MeshBasicMaterialParameters} parameters 
     * @returns 
     */
    onAfterSetMaterial(material, parameters) {
        if (material.map.name.includes('grass_block_top')) {
            material.color.set('#779b56')
        }

        return material;
    }
}

export default function (textures) {
    return new GrassMaterials(textures).getResultMaterials();
}
