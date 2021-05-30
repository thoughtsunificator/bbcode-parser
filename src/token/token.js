/** @module token/token */

/**
 * @memberof: module:token/token
 */
class Token {

	/**
	 * @readonly
	 * @enum {string}
	 */
	static NAME = {
		TEXT: "text",
		OPENING_TAG: "opening tag",
		CLOSING_TAG: "closing tag"
	}

	/**
	 * @param {string} name
	 * @param {string} buffer
	 * @param {number} bufferIndex
	 */
	constructor(name, buffer, bufferIndex) {
		this._name = name
		this._buffer = buffer
		this._bufferIndex = bufferIndex
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
	get buffer() {
		return this._buffer
	}

	/**
	 * @readonly
	 * @type {number}
	 */
	get bufferIndex() {
		return this._bufferIndex
	}

}

export default Token