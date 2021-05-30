/** @module token/tagtoken */

import Token from "./token.js"

/**
 * @memberof: module:token/tagtoken
 */
class TagToken extends Token {

	/**
	 * @param {string} name
	 * @param {string} buffer
	 * @param {number} bufferIndex
	 * @param {Key[]}  keys
	 */
	constructor(name, buffer, bufferIndex, keys = []) {
		super(name, buffer, bufferIndex)
		this._keys = keys
	}

	/**
	 * @readonly
	 * @type {Key[]}
	 */
	get keys() {
		return this._keys
	}

}

export default TagToken