/** @module token/key */

/**
 * @memberof: module:token/key
 */
class Key {

	/**
	 * @param {string} name
	 * @param {string} value
	 */
	constructor(name, value) {
		this._name = name
		this._value = value
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get name() {
		return this._name
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get value() {
		return this._value
	}

}

export default Key