import {
    BoxGeometry,
    Material,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    Texture,
    TextureLoader,
} from "three";

export class CubeMaterials {
    loader = new TextureLoader();
    geometry = new BoxGeometry();
    textures = [];

    result_material = null;
    /**
     *
     * @param {{top:String, bottom:String, sides:{{left:String, right: String, front: String, behind: String}}|String}} textures
     */
    constructor(textures) {
        if (textures.sides instanceof Object) {
            this.textures.push(textures.sides.right);
            this.textures.push(textures.sides.left);
            this.textures.push(textures.top);
            this.textures.push(textures.bottom);
            this.textures.push(textures.sides.front);
            this.textures.push(textures.sides.behind);
        } else {
            this.textures.push(textures.sides);
            this.textures.push(textures.sides);
            this.textures.push(textures.top);
            this.textures.push(textures.bottom);
            this.textures.push(textures.sides);
            this.textures.push(textures.sides);
        }
    }

    setTexture(path) {
        let texture = this.loader.load(path);
        let paths = path.split('/');
        texture.name = paths.at(paths.length - 1).replace(/\..*/g, '');
        texture.magFilter = NearestFilter;
        texture = this.onAfterSetTexture(texture, path) ?? texture;
        return texture;
    }

    /**
     * 
     * @param {Texture} texture 
     * @param {String} path 
     * @returns 
     */
    onAfterSetTexture(texture, path) {
        return texture;
    }

    /**
     *
     * @param {import("three").MeshBasicMaterialParameters} parameters
     * @returns
     */
    setMaterial(parameters) {
        let material = new MeshBasicMaterial(parameters);
        material = this.onAfterSetMaterial(material, parameters) ?? material;
        return material;
    }

    /**
     * 
     * @param {MeshBasicMaterial} material 
     * @param {*} parameters 
     * @returns 
     */
    onAfterSetMaterial(material, parameters) {
        return material;
    }

    getResultMaterials()
    {
        let materials = [];

        this.textures.forEach((path) => {
            materials.push(this.setMaterial({ map: this.setTexture(path) }));
        });
        this.result_material = materials;
        return this.result_material;
    }

    getMesh() {
        let materials = [];

        this.textures.forEach((path) => {
            materials.push(this.setMaterial({ map: this.setTexture(path) }));
        });
        this.result_material = materials;
        return new Mesh(this.geometry, materials);
    }
}


export default function (textures) {
    return new CubeMaterials(textures).getResultMaterials();
}
