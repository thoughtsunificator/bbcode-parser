/** @module bbdocument/bbelement */

import * as Parser from "../parser.js"
import BBNode from "./bbnode.js"
import TreeWalker from "./treewalker.js"

/**
 * @memberof module:bbdocument/bbelement
 */
class BBElement extends BBNode {

	/**
	 * @param  {string}   name
	 * @param  {string} 	[value=null]
	 */
	constructor(name, value = null) {
		super()
		this._nodeType = BBNode.ELEMENT_BBNODE
		this._childNodes = []
		this._tagName = name
		this._keys = new Map([ [name, value] ])
		this._innerBBCode = ""
		const tags = this.tags()
		this._outerBBCode = `${tags.opening}${tags.closing}`
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get tagName() {
		return this._tagName
	}

	/**
	 * @readonly
	 * @type {BBNode[]}
	 */
	get childNodes() {
		return this._childNodes
	}

	/**
	 * @readonly
	 * @type {Map}
	 */
	get keys() {
		return this._keys
	}

	/**
	 * @type {string}
	 */
	get innerBBCode() {
		return this._innerBBCode
	}

	set innerBBCode(innerBBCode) {
		for(let i = 0; i < this.childNodes.length; i++) {
			this.removeChild(this.childNodes[i])
			i--
		}
		const childNodes = Parser.parse(innerBBCode).documentElement.childNodes
		for(const node of childNodes) {
			this.appendChild(node)
		}
		this._innerBBCode = innerBBCode
	}

	/**
	 * @readonly
	 * @type {string}
	 */
	get outerBBCode() {
		return this._outerBBCode
	}

	/**
	 * @ignore
	 * @param {string}        name
	 * @param {string|number} value
	 */
	setKey(name, value = null) {
		this._keys.set(name, value)
		const tags = this.tags()
		this._outerBBCode = `${tags.opening}${tags.closing}`
	}

	/**
	 * @param  {BBNode} bbNode
	 */
	appendChild(bbNode) {
		if(this.childNodes.length >= 1) {
			const lastBBNode = this.childNodes[this.childNodes.length - 1]
			lastBBNode._nextSibling = bbNode
			bbNode._previousSibling = lastBBNode
		}
		bbNode._parentNode = this
		this.childNodes.push(bbNode)
		this.build()
	}

	/**
	 * @param  {BBNode} bbNode
	 */
	removeChild(bbNode) {
		if(bbNode.previousSibling !== null) {
			bbNode.previousSibling._nextSibling = bbNode.nextSibling
		}
		if(bbNode.nextSibling !== null) {
			bbNode.nextSibling._previousSibling = bbNode.previousSibling
		}
		this.childNodes.splice(this.childNodes.indexOf(bbNode), 1)
		this.build()
	}

	/**
	 * @ignore
	 * Used to rebuild the Node hierarchy after either textContent or innerBBCode was updated
	 */
	build() {
		const nodeList = [this]
		let parentNode = this.parentNode
		while (parentNode !== null) {
			nodeList.push(parentNode)
			parentNode = parentNode.parentNode
		}
		for(const node of nodeList) {
			node._textContent = Parser.serialize(node, { excludeBBCode: true })
			node._innerBBCode = Parser.serialize(node, { excludeBBCode: false })
			node._outerBBCode = Parser.serialize(node, { excludeRoot: false })
		}
	}

	/**
	 * Converts an array of keys into an opening and closing tag string
	 * @param  {Object[]} keys
	 * @returns {object}
	 */
	tags() {
		const tags = { opening: "", closing: "" }
		tags.opening += "["
		for(const [key, value] of this.keys) {
			if (tags.opening.length >= 2) {
				tags.opening += " "
			}
			tags.opening += key
			if (value !== null) {
				if (value.includes(" ") === true) {
					tags.opening += "=" + "\"" + value + "\""
				} else {
					tags.opening += "=" + value
				}
			}
		}
		tags.opening += "]"
		if(this.tagName !== "*") {
			tags.closing = "[/" + this.tagName + "]"
		}
		return tags
	}

	/**
	 * @param   {string} tagName
	 * @returns {BBNode}
	 */
	querySelector(tagName) {
		const treeWalker = new TreeWalker(this)
		let node = null
		while(treeWalker.nextNode()) {
			if(treeWalker.currentNode.tagName === tagName) {
				node = treeWalker.currentNode
				break
			}
		}
		return node
	}

	/**
	 * @param   {string} tagName
	 * @returns {BBNode[]}
	 */
	querySelectorAll(tagName) {
		const treeWalker = new TreeWalker(this)
		let nodeList = []
		while(treeWalker.nextNode()) {
			if(treeWalker.currentNode.tagName === tagName) {
				nodeList.push(treeWalker.currentNode)
			}
		}
		return nodeList
	}

}

export default BBElement
