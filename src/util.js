/** @module util */

/**
 * Inserts text at a given index
 * @param  {string} str 	The string where the text should be inserted
 * @param  {string} text 	The text to be inserted
 * @param  {number} index The index relative to the string
 * @returns {string} 			The new string
 */
function insertText(str, text, index) {
	return str.substring(0, index) + text + str.substring(index, str.length)
}

export {
	insertText
}
