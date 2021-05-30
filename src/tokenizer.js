/** @module tokenizer */

import Token from "./token/token.js"
import TextToken from "./token/texttoken.js"
import TagToken from "./token/tagtoken.js"
import Key from "./token/key.js"

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
const DIGITS = "0123456789"
const CHARACTERS_SPECIAL_TAG_NAME = "*"
const CHARACTERS_SPECIAL_TAG_VALUE = "#:/."

const CHARACTERS_TAG_NAME = [...ALPHABET + CHARACTERS_SPECIAL_TAG_NAME]
const CHARACTERS_TAG_VALUE = [...ALPHABET + DIGITS + CHARACTERS_SPECIAL_TAG_VALUE]

/**
 * @param   {string}  str The text input
 * @returns {Token[]}			An array of tokens
 */
function tokenize(str) {
	const characters = [...str]
	let buffer = ""
	const tokens = []
	const keys = []
	for(const [index, character] of characters.entries()) {
		buffer += character
		const bufferIndex = index - buffer.length + 1
		if (buffer[0] + buffer[1] === "[/") {
			if (buffer.length === 2) {
				continue
			}
			if (keys.length === 0) {
				if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
					keys.push(new Key(character, null))
				} else {
					tokens.push(new TextToken(buffer, bufferIndex))
					buffer = ""
				}
			} else if (keys.length >= 1) {
				const key = keys[keys.length - 1]
				if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
					key._name += character
				} else if (character === "]") {
					tokens.push(new TagToken(Token.NAME.CLOSING_TAG, buffer, bufferIndex, [...keys]))
					keys.splice(0, keys.length)
					buffer = ""
				} else {
					tokens.push(new TextToken(buffer, bufferIndex))
					keys.splice(0, keys.length)
					buffer = ""
				}
			}
		} else if (buffer[0] === "[") {
			if (buffer.length === 1) {
				continue
			}
			if (keys.length === 0) {
				if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
					keys.push(new Key(character, null))
				} else {
					tokens.push(new TextToken(buffer, bufferIndex))
					buffer = ""
				}
			} else if (keys.length >= 1) {
				const key = keys[keys.length - 1]
				if (typeof key.value === "string") {
					if (key.value.length === 0) {
						if (CHARACTERS_TAG_VALUE.includes(character.toLowerCase()) === true || character === "'" || character === '"') {
							key._value += character
						} else {
							tokens.push(new TextToken(buffer, bufferIndex))
							buffer = ""
							keys.splice(0, keys.length)
						}
					} else if (key.value.length >= 1) {
						const parsingQuote = (key.value[0] === "'" || key.value[0] === '"')
						&& (key.value[0] !== key.value[key.value.length -1] || key.value.length === 1)
						if ((key.value[0] === "'" ||  key.value[0] === '"') && (parsingQuote === false && key.value.length > 1 && key.value[0] === key.value[key.value.length -1])) {
							key._value = key.value.substring(1, key.value.length - 1)
						}
						if (CHARACTERS_TAG_VALUE.includes(character.toLowerCase()) === true || parsingQuote) {
							key._value += character
						} else if (character === "]") {
							tokens.push(new TagToken(Token.NAME.OPENING_TAG, buffer, bufferIndex, [...keys]))
							keys.splice(0, keys.length)
							buffer = ""
						} else if (character === " ") {
							keys.push(new Key("", null))
						} else {
							tokens.push(new TextToken(buffer, bufferIndex))
							buffer = ""
							keys.splice(0, keys.length)
						}
					}
				} else if (CHARACTERS_TAG_NAME.includes(character.toLowerCase()) === true) {
					key._name += character
				} else if (character === "]") {
					tokens.push(new TagToken(Token.NAME.OPENING_TAG, buffer, bufferIndex, [...keys]))
					keys.splice(0, keys.length)
					buffer = ""
				} else if (character === "=") {
					key._value = ""
				} else if (key.name.length >= 1 && character === " ") {
					keys.push(new Key("", null))
				} else {
					tokens.push(new TextToken(buffer, bufferIndex))
					buffer = ""
					keys.splice(0, keys.length)
				}
			}
		} else {
			tokens.push(new TextToken(buffer, bufferIndex))
			buffer = ""
		}
	}
	return tokens
}

export {
	tokenize
}