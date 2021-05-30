/** @module bbdocument/bbtext */

import BBNode from "./bbnode.js"

/**
 * @memberof module:bbdocument/bbtext
 */
class BBText extends BBNode {

	/**
	 * @param {string} text
	 */
	constructor(text) {
		super()
		this._nodeType = BBNode.TEXT_BBNODE
		this._textContent = text
	}

}

export default BBText
