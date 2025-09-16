import EventNames from "../../../../../server/api/EventNames.mjs";
import Network from "../../../ship/Network/Network";
import BlockData from "./BlockData";

export default class BlockPositions {
    /**
     * @private
     */
    data = [];

    #setBlock(x, y, z, instanceId, tags = [], index = null) {
        if (!this.data[x]) this.data[x] = [];
        if (!this.data[x][y]) this.data[x][y] = [];
        this.data[x][y][z] = new BlockData(instanceId, tags).getObject();
        if (index !== null) {
            this.data[x][y][z].setIndex(index);
        }
    }

    #setBlockIndex(x, y, z, index)
    {

    }

    getData() {
        return this.data;
    }

    storeData() {
        Network.Socket.emit(EventNames.CHUNK_CREATED, JSON.stringify(this.getData()));
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} instanceId
     */
    addBlockPosition(x, y, z, instanceId, tags = [], index) {
        this.#setBlock(x, y, z, instanceId, tags, index);
    }

    setBlockIndex(x, y, z, index)
    {
        this.#setBlockIndex(x, y, z, index);
    }

    setIndexCoordinaes(index, x, y, z)
    {
        let res = this.data.filter(yses => yses?.filter(zses => zses?.filter(blockData => blockData.index === index).length).length);
        if (res.length) {

            let _x = Object.keys(res).at(0)
            let _y = Object.keys(res[_x]).at(0);
            let _z = Object.keys(res[_x][_y]).at(0);

            let block = res[_x][_y][_z];

            
            this.data[x][y][z] = block;

        }

    }

    getBlockAt(_x, _y, _z) {
        let x = Number(_x),
            y = Number(_y),
            z = Number(_z);

        if (!this.data[x]) return null;
        if (!this.data[x][y]) return null;
        if (!this.data[x][y][z]) return null;
        return this.data[x][y][z];
    }

    getBlockInstanceId(x, y, z) {
        return this.data[x][y][z];
    }
}
