import BlockData from "./BlockData";

export default class BlockPositions {
    /**
     * @private
     */
    data = [];

    #setBlock(x, y, z, instanceId, tags = []) {
        if (!this.data[x]) this.data[x] = [];
        if (!this.data[x][y]) this.data[x][y] = [];
        this.data[x][y][z] = new BlockData(instanceId, tags).getObject();
    }

    getData() {
        return this.data;
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} instanceId 
     */
    addBlockPosition(x, y, z, instanceId) {
        this.#setBlock(x, y, z, instanceId);
    }

    getBlockAt(_x, _y, _z) {
        let x = Number(_x),
            y = Number(_y),
            z = Number(_z)

        if (!this.data[x]) return null;
        if (!this.data[x][y]) return null;
        if (!this.data[x][y][z]) return null;
        return this.data[x][y][z];
    }

    getBlockInstanceId(x, y, z) {
        return this.data[x][y][z];
    }
}
