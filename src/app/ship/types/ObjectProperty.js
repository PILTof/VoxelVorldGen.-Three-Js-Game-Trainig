/**
 * @abstract
 */
export default class ObjectProperty {

    /**
     * 
     * @param {String} key 
     * @param {*} value 
     * @returns {ObjectProperty}
     */
    setValue(key, value) {
        if (typeof this.params[key] == "undefined") throw new Error(`Param ${key} not found`);
        this.params[key] = value;
        return this;
    }
    fillValues(params) {
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(this.params, key)) {
                const value = params[key];
                this.params[key] = value;
            }
        }
        return this;
    }

    getValue(key) {
        return this.params[key];
    }

    getValues() {
        return this.params;
    }
}
