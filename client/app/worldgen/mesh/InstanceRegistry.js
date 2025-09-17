import BlockInstance from "../../ship/Abstract/BlockInstance";
import DirtInstance from "./instances/DirtInstance";
import GrassInstance from "./instances/GrassInstance";

export default class BlockRegistries {
    static DEFAULT_MAX = 256 * 3000;

    static GRASS = new GrassInstance(BlockRegistries.DEFAULT_MAX).init();
    static DIRT = new DirtInstance(BlockRegistries.DEFAULT_MAX).init();
}

export class InstanceRegistry extends Object {
    /**
     *
     * @param {BlockRegistries} key
     */
    static get(key) {
        return BlockRegistries[key];
    }

    /**
     *
     * @param {Number} id
     */
    static getInstanceById(id) {
        let key;
        for (key in BlockRegistries) {
            if (
                BlockRegistries[key] instanceof BlockInstance &&
                BlockRegistries[key].getInstanceId() === id
            ) {
                return BlockRegistries[key];
            }
        }
    }

    /**
     *
     * @param {string} key
     * @param {typeof BlockInstance} registry
     */
    static register(key, registry) {
        BlockRegistries[key] = registry;
    }
}
