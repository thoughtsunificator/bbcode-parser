/** @module bbcode */

import * as Parser from "./parser.js"
import * as Util from "./util.js"

/**
 * Converts an array of keys into a tag object
 * @param   {Object[]} keys
 * @param   {string}   keys.name
 * @param   {string}   keys.value
 * @returns {object}
 */
function keysToTags(keys) {
	const tags = {opening: "", closing: ""}
	tags.opening += "["
	keys.forEach((key, index) => {
		if (index >= 1) {
			tags.opening += " "
		}
		tags.opening += key.name
		if (key.value !== null) {
			if (key.value.includes(" ") === true) {
				tags.opening += "=" + "\"" + key.value + "\""
			} else {
				tags.opening += "=" + key.value
			}
		}
	})
	tags.opening += "]"
	tags.closing = "[/" + keys[0].name + "]"
	return tags
}

/**
 * Converts HTML to BBCode
 * @param   {string} input         HTML string to be converted into BBCode
 * @param   {string} templateName  The name of the BBCode template
 * @returns {string}               The BBCode output
 */
function bbcode(input, template) {
	const element = document.createElement("div")
	element.innerHTML = input

	const treeWalker = document.createTreeWalker(element)
	const nodeList = []
	while (treeWalker.nextNode()) {
		nodeList.push(treeWalker.currentNode)
	}

	const ignoreList = []
	const items = []
	let output = ""

	nodeList.forEach(node => {
		if (ignoreList.indexOf(node) !== -1) {
			return
		}
		let tags
		let nodeOutput = ""
		if (node.nodeType === Node.ELEMENT_NODE) {
			let bbcode = template.keys.find(key => key.testNode(node) === true)
			if (typeof bbcode === "object") {
				if (typeof bbcode.updateIgnoreList === "function") {
					bbcode.updateIgnoreList(ignoreList, node)
				}
				if (typeof bbcode.tags === "object") {
					tags = bbcode.tags
				}
				else {
					tags = keysToTags(bbcode.keys(node))
				}
				if (typeof bbcode.getStr === "function") {
					nodeOutput = bbcode.getStr(bbcode.keys(node), node)
				}
				else {
					nodeOutput = tags.opening + tags.closing
				}
			} else {
				nodeOutput = node.outerHTML
				let treeWalker2 = document.createTreeWalker(node)
				while (treeWalker2.nextNode())
					ignoreList.push(treeWalker2.currentNode)
			}
		} else if (node.nodeType === Node.TEXT_NODE) {
				nodeOutput = node.textContent
		}

		const parent = items.find(item => item.node === node.parentNode)
		const item = { node }

		if (typeof parent === "undefined") {
			output += nodeOutput
			if (typeof tags === "object") {
				item.childIndex = output.length - tags.closing.length
			}
		} else {
			output = Util.insertText(output, nodeOutput, parent.childIndex)
			const parents = []
			let currentNode = node.parentNode
			while (currentNode != null) {
				parents.push(currentNode)
				currentNode = currentNode.parentNode
			}
			parents.forEach(parentItem => {
				const item2 = items.find(listItem => listItem.node === parentItem)
				if (typeof item2 !== "undefined") {
					item2.childIndex += nodeOutput.length
				}
			})
			if (typeof tags === "object") {
				item.childIndex = parent.childIndex - tags.closing.length
			}
		}
		items.push(item)
	})
	return output
}

/**
 * Converts BBCode to HTML
 * Parse BBCode input into abstract tree made of tokens and turn them into nodes
 * @param   {string} input         BBCode string to be converted into HTML
 * @param   {Object} templateName  The name of the BBCode template
 * @returns {string}               The HTML output
 */
function html(input, template) {
	const elements = Parser.parse(input)
	const element = document.createElement("div")
	const items = []
	elements.forEach(token => {
		let node
		if (token.name === "bbcode") {
			const bbcode = template.keys.find(key => key.name === token.openingTag.keys[0].name)
			if (typeof bbcode !== "undefined") {
				node = bbcode.node(token.openingTag.keys, token)
			}
			else {
				node = document.createTextNode(token.openingTag.buffer + token.closingTag.buffer)
			}
		} else {
			node = document.createTextNode(token.buffer)
		}
		const parents = items.filter(parent => token.parents.includes(parent.bbcode))
		if (parents.length >= 1) {
			template.handleChildNode(node, token, items, parents)
		}
		else {
			element.appendChild(node)
		}
		items.push({bbcode: token, node})
	})
	return element.innerHTML
}

export {
	keysToTags,
	bbcode,
	html
}
