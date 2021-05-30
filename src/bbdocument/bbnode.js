/** @module bbdocument/bbnode */

import * as Parser from "../parser.js"
import { BBElement, BBText } from "../../index.js"

/**
 * @memberof module:bbdocument/bbnode
 */
class BBNode {

	/**
	 * @readonly
	 * @type {Number}
	 */
	static ELEMENT_BBNODE = 1
	/**
	 * @readonly
	 * @type {Number}
	 */
	static TEXT_BBNODE = 2

	constructor() {
		this._ownerDocument = null
		this._parentNode = null
		this._previousSibling = null
		this._nextSibling = null
		this._textContent = ""
	}

	/**
	 * @readonly
	 * @type {BBElement}
	 */
	get ownerDocument() {
		return this._ownerDocument
	}

	/**
	 * @readonly
	 * @type {BBElement}
	 */
	get parentNode() {
		return this._parentNode
	}

	/**
	 * @readonly
	 * @type {BBNode}
	 */
	get previousSibling() {
		return this._previousSibling
	}

	/**
	 * @readonly
	 * @type {BBNode}
	 */
	get nextSibling() {
		return this._nextSibling
	}

	/**
	 * @readonly
	 * @type {number}
	 */
	get nodeType() {
		return this._nodeType
	}

	/**
	 * @type {string}
	 */
	get textContent() {
		return this._textContent
	}

	set textContent(textContent) {
		if(this.nodeType === BBNode.ELEMENT_BBNODE) {
			for(let i = 0; i < this.childNodes.length; i++) {
				this.removeChild(this.childNodes[i])
				i--
			}
			const bbText = Parser.parse(textContent).documentElement.childNodes[0]
			this.appendChild(bbText)
		}
		this._textContent = textContent
	}

	remove() {
		this.parentNode.removeChild(this)
	}

	/**
	 * @param   {boolean} deep
	 * @returns {BBNode}
	 */
	cloneNode(deep) {
		let bbNode
		if(this.nodeType === BBNode.ELEMENT_BBNODE) {
			bbNode = new BBElement(this.tagName)
			for(const [key, value] of this.keys) {
				bbNode.setKey(key, value)
			}
			bbNode._keys = new Map(this.keys)
			if(deep) {
				bbNode.innerBBCode = this.innerBBCode
			}
		} else {
			bbNode = new BBText(this.textContent)
		}
		return bbNode
	}

}

export default BBNode
