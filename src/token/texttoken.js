/** @module token/texttoken */

import Token from "./token.js"

/**
 * @memberof: module:token/texttoken
 */
class TextToken extends Token {

	/**
	 * @param {string} name
	 * @param {string} buffer
	 * @param {number} bufferIndex
	 */
	constructor(buffer, bufferIndex) {
		super(Token.NAME.TEXT, buffer, bufferIndex)
	}

}

export default TextToken