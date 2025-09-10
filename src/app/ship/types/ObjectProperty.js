/**
 * @abstract
 */
export default class ObjectProperty {

    setValue(key, value) {
        if (typeof this.params[key] == "undefined") throw new Error(`Param ${key} not found`);
        this.params[key] = value;
    }
    fillValues(params) {
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(this.params, key)) {
                const value = params[key];
                this.params[key] = value;
            }
        }
    }

    getValue(key) {
        return this.params[key];
    }

    getValues() {
        return this.params;
    }
}
