import { Scene } from "three";
import Params from "../../ship/Abstract/Params";

export default class WorldParams extends Params {
    static MAX_WORLD_SIZE = "max_world_size";
    static GEN_RADIUS = "gen_radius";
    static SEED = "seed";

    params = {
        [WorldParams.MAX_WORLD_SIZE]: 16 * 256,
        [WorldParams.GEN_RADIUS]: 1,
        [WorldParams.SEED]: Math.random(),
    };
}
