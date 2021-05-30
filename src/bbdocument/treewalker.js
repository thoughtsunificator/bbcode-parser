/** @module bbdocument/treewalker */

import BBNode from "./bbnode.js"

/**
 * @memberof module:bbdocument/treewalker
 */
class TreeWalker {

	/**
	 * @param {BBElement} rootNode
	 */
	constructor(rootNode) {
		this._currentNode = rootNode
		this._rootNode = rootNode
		this._path = []
	}

	/**
	 * @readonly
	 * @type {BBElement}
	 */
	get currentNode() {
		return this._currentNode
	}

	/**
	 * @returns {BBElement}
	 */
	parentNode() {
		this._currentNode = this._currentNode.parentNode
		return this._currentNode
	}

	nextNode() {
		if(this.currentNode.nodeType === BBNode.ELEMENT_BBNODE && this.currentNode.childNodes.length >= 1) {
			const previousNode = this.currentNode
			this._currentNode = this.currentNode.childNodes[0]
			if(previousNode !== this._rootNode) {
				this._path.push(previousNode)
			}
		} else if(this.currentNode.nextSibling !== null  && !this._path.includes(this.currentNode.nextSibling)) {
			this._path.push(this.currentNode.nextSibling)
			this._currentNode = this.currentNode.nextSibling
		} else {
			this._currentNode = null
			const parents = this._path.slice()
			parents.reverse()
			for(const node of parents) {
				if(node.nextSibling !== null && !this._path.includes(node.nextSibling)) {
					this._currentNode = node.nextSibling
					this._path.push(node.nextSibling)
					break
				}
			}
		}
		return this.currentNode
	}

}

export default TreeWalker
