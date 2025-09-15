import Params from "../../ship/Abstract/Params";

export default class HeightMapParams extends Params {
    static CHUNK_SCALE = "chunk_scale";
    static OFFSET_X = "offset_x";
    static OFFSET_Z = "offset_z";
    static LOG_VALUE = "log_value";
    static HEIGHT_MULTIPLYER_VALUE = "height_multiplyer_value";
    static HEIGHT_OFFSET_VALUE = "height_offset_value";

    params = {
        [HeightMapParams.CHUNK_SCALE]: 16,
        [HeightMapParams.LOG_VALUE]: 20,
        [HeightMapParams.HEIGHT_MULTIPLYER_VALUE]: 2,
        [HeightMapParams.HEIGHT_OFFSET_VALUE]: 10,
        [HeightMapParams.OFFSET_X]: 0,
        [HeightMapParams.OFFSET_Z]: 0,
    };
}
