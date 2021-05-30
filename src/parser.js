/** @module parser */

import * as Tokenizer from "./tokenizer.js"
import BBDocument from "./bbdocument/bbdocument.js"
import BBNode from "./bbdocument/bbnode.js"
import Token from "./token/token.js"
import TagToken from "./token/tagtoken.js"

/**
 * @param  {Node}    rootNode
 * @param  {object}  parameters
 * @param  {boolean} parameters.excludeBBCode=false
 * @param  {boolean} parameters.excludeRoot=true
 * @returns {string}
 */
function serialize(rootNode, {excludeBBCode = false, excludeRoot = true} = {}) {
	let str = ""
	if(rootNode.nodeType === BBNode.ELEMENT_BBNODE) {
		const tags = rootNode.tags()
		let str_ = ""
		for(const bbNode of rootNode.childNodes) {
			str_ += serialize(bbNode, { excludeBBCode, excludeRoot: false })
		}
		if((!rootNode.ownerDocument || rootNode.ownerDocument.documentElement !== rootNode) && excludeBBCode === false && excludeRoot === false) {
			str += `${tags.opening}${str_}${tags.closing}`
		} else {
			str += str_
		}
	} else {
		str += rootNode.textContent
	}
	return str
}

/**
 * @param  {string}   str
 * @returns {Object[]}
 */
function tokenize(str) {
	let tokens = Tokenizer.tokenize(str)
	let openedCodeCount = 0
	let raw = false
	let rawTokens = []
	tokens.filter(token => token.name === Token.NAME.OPENING_TAG || token.name === Token.NAME.CLOSING_TAG).forEach(function(token) {
		if (token.name === Token.NAME.OPENING_TAG && token.keys[0].name === "code") {
			if (raw === true) {
				rawTokens.push(token)
				openedCodeCount++
			} else {
				raw = true
			}
		} else if (token.name === Token.NAME.CLOSING_TAG && token.keys[0].name === "code") {
			if (raw === true && openedCodeCount === 0) {
				rawTokens.forEach(function(token_) {
					token_._name = Token.NAME.TEXT
				})
				raw = false
				rawTokens = []
			} else {
				rawTokens.push(token)
				if (openedCodeCount >= 1) {
					openedCodeCount--
				}
			}
		} else if (raw === true) {
			rawTokens.push(token)
		}
	})
	const openedTokens = []
	const matchedTokens = []
	tokens.filter(token => token.name === Token.NAME.OPENING_TAG || token.name === Token.NAME.CLOSING_TAG).forEach(token => {
		if (token.name === Token.NAME.OPENING_TAG) {
			if (token.keys[0].name === "*") {
				const matches = openedTokens.filter(openedToken => openedToken.keys[0].name === "*")
				if (matches.length >= 1) {
					matchedTokens.push({
						name: "bbcode",
						bufferIndex: matches[matches.length - 1].bufferIndex,
						openingTag: matches[matches.length - 1],
						closingTag: new TagToken(Token.NAME.CLOSING_TAG, token.buffer, token.bufferIndex, token.keys),
					})
					openedTokens.splice(openedTokens.indexOf(matches[matches.length - 1]), 1)
				}
			}
			openedTokens.push(token)
		} else if (token.name === Token.NAME.CLOSING_TAG) {
			if (token.keys[0].name === "list") {
				const peers_ = openedTokens.filter(openedToken => openedToken.keys[0].name === "*")
				if (peers_.length >= 1) {
					matchedTokens.push({
						name: "bbcode",
						bufferIndex: peers_[peers_.length - 1].bufferIndex,
						openingTag: peers_[peers_.length - 1],
						closingTag: token,
					})
					openedTokens.splice(openedTokens.indexOf(peers_[peers_.length - 1]), 1)
				}
			}
			const matches = openedTokens.filter(openedToken => openedToken.keys[0].name ===  token.keys[0].name)
			if (matches.length >= 1 && token.keys[0].name !== "*") {
				openedTokens.splice(openedTokens.indexOf(matches[matches.length - 1]), 1)
				matchedTokens.push({
					name: "bbcode",
					bufferIndex: matches[matches.length - 1].bufferIndex,
					openingTag: matches[matches.length - 1],
					closingTag: token
				})
			} else {
				token._name = Token.NAME.TEXT
			}
		}
	})
	for(const token of openedTokens) {
		token._name = Token.NAME.TEXT
	}
	let mergedTextToken = null
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].name === Token.NAME.TEXT) {
			if (mergedTextToken === null) {
				mergedTextToken = tokens[i]
			} else {
				mergedTextToken._buffer += tokens[i].buffer
				tokens.splice(i, 1)
				i--
			}
		} else {
			mergedTextToken = null
		}
	}
	tokens = matchedTokens.concat(tokens.filter(token => token.name === Token.NAME.TEXT))
	tokens.sort((a, b) => a.bufferIndex - b.bufferIndex)
	return tokens
}

/**
 * @param   {string} 	   str The input text
 * @returns {BBDocument}     An array of BBNode
 */
function parse(str) {
	let tokens = tokenize(str)
	const bbDocument = new BBDocument()
	tokens = tokens.map(token => {
		if(token.name === "bbcode") {
			const keys = token.openingTag.keys
			const bbNode = bbDocument.createElement(keys[0].name, keys[0].value)
			keys.slice(1).forEach(key => bbNode.setKey(key.name, key.value))
			token.bbNode = bbNode
		} else if(token.name === Token.NAME.TEXT) {
			token.bbNode = bbDocument.createTextNode(token.buffer)
		}
		return token
	})
	tokens.forEach(token => {
		const parents = tokens.filter(token_ => token_.name === "bbcode" && token_ !== token && token_.bufferIndex < token.bufferIndex && token.bufferIndex < token_.closingTag.bufferIndex)
		if (parents.length >= 1) {
			parents[parents.length - 1].bbNode.appendChild(token.bbNode)
		} else {
			bbDocument.documentElement.appendChild(token.bbNode)
		}
	})
	return bbDocument
}

export {
	serialize,
	tokenize,
	parse
}
