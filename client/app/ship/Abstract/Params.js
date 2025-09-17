/**
 * @property params
 * @abstract
 */
export default class Params {
    fillValues(params) {
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(this.params, key)) {
                const newValue = params[key];
                this.params[key] = newValue;
            }
        }
        return this;
    }

    setValue(key, value) {
        if (!Object.prototype.hasOwnProperty(this.params, key))
            throw new Error("Undefined key: " + key);
        this.params[key] = value;
    }

    getValue(key) {
        if (!Object.prototype.hasOwnProperty.call(this.params, key))
            throw new Error("Undefined key: " + key);
        return this.params[key];
    }
}
