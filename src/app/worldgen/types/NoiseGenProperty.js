import ObjectProperty from "../../ship/types/ObjectProperty";

export default class NoiseGenProperty extends ObjectProperty {
    /**
     * @param {Number} params.heightFunc
     */
    params = {
        heightFunc: 20,
        fullHeight: 4,
        heightOffset: 8.9,
        offsetX: 0,
        offsetZ: 0,
        chunkScale: 50
    };
}