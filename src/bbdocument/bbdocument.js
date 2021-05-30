/** @module bbdocument/bbdocument */

import BBElement from "./bbelement.js"
import BBText from "./bbtext.js"
import TreeWalker from "./treewalker.js"

/**
 * @memberof module:bbdocument/bbdocument
 */
class BBDocument {

	constructor() {
		this._documentElement = new BBElement()
		this._documentElement._ownerDocument = this
	}

	/**
	 * @readonly
	 * @type {BBElement}
	 */
	get documentElement() {
		return this._documentElement
	}

	/**
	 * @param  {string} text
	 * @returns {BBText}
	 */
	createTextNode(text) {
		const bbNode = new BBText(text)
		bbNode._ownerDocument = this
		return bbNode
	}

	/**
	 * @param   {string}        name
	 * @param   {string|number} value
	 * @returns {BBElement}
	 */
	createElement(name, value) {
		const bbNode = new BBElement(name, value)
		bbNode._ownerDocument = this
		return bbNode
	}

	/**
	 * @param   {BBElement}  rootNode
	 * @returns {TreeWalker}
	 */
	createTreeWalker(rootNode) {
		return new TreeWalker(rootNode)
	}

}

export default BBDocument
