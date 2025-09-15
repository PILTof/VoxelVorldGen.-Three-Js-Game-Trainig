export default class BlockData {
    /**
     * @private
     * @readonly
     */
    #data = {
        instanceId: 0,
        tags: [],
    };

    /**
     *
     * @param {Number} instanceId
     * @param {Array} tags
     */
    constructor(instanceId, tags) {
        this.#data.instanceId = instanceId;
        this.#data.tags = tags;
    }

    getObject() {
        return this.#data;
    }
}
