import ObjectProperty from "../../ship/types/ObjectProperty";

class NoiseGenProperty extends ObjectProperty {
    static HEIGHT_FUNC = "heightFunc";
    static HEIGHT_POSITION = "heightPosition";
    static HEIGHT_OFFSET = "heightOffset";
    static OFFSET_X = "offsetX";
    static OFFSET_Z = "offsetZ";
    static CHUNK_SCALE = "chunkScale";

    /**
     * @param {Number} params.heightFunc - логарифм высоты
     * @param {Number} params.heightPosition - позиция логарифма
     * @param {Number} params.heightOffset - смещение высоты
     * @param {Number} params.offsetX - смещение по х
     * @param {Number} params.offsetY - смещение по Y
     * @param {Number} params.chunkScale - размер чанка x,y
     */
    params = {
        heightFunc: 20,
        heightPosition: 4,
        heightOffset: 8.9,
        offsetX: 0,
        offsetZ: 0,
        chunkScale: 50,
    };
}

export default NoiseGenProperty;
