import assert from "assert"
import { Token, Tokenizer } from "../index.js"

describe("schema", () => {

	it("schema", () => {

		const tokens = Tokenizer.tokenize("a[a*][/a*]")
		assert.ok(tokens instanceof Array)
		assert.strictEqual(tokens.length, 3)
		// a
		assert.strictEqual(Object.keys(tokens[0]).length, 3)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[0], "_bufferIndex"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[0], "_buffer"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[0], "_name"), true)
		assert.strictEqual(typeof tokens[0].bufferIndex, "number")
		assert.strictEqual(typeof tokens[0].buffer, "string")
		assert.strictEqual(typeof tokens[0].name, "string")
		assert.strictEqual(tokens[0].name, Token.NAME.TEXT)
		assert.strictEqual(typeof tokens[0].keys, "undefined")
		// [a*]
		assert.strictEqual(Object.keys(tokens[1]).length, 4)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "_bufferIndex"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "_buffer"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "_name"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "_keys"), true)
		assert.strictEqual(typeof tokens[1].bufferIndex, "number")
		assert.strictEqual(typeof tokens[1].buffer, "string")
		assert.strictEqual(typeof tokens[1].name, "string")
		assert.ok(tokens[1].keys instanceof Array)
		assert.strictEqual(tokens[1].name, Token.NAME.OPENING_TAG)
		// [/a*]
		assert.strictEqual(Object.keys(tokens[2]).length, 4)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[2], "_bufferIndex"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[2], "_buffer"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[2], "_name"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[2], "_keys"), true)
		assert.strictEqual(typeof tokens[2].bufferIndex, "number")
		assert.strictEqual(typeof tokens[2].buffer, "string")
		assert.strictEqual(typeof tokens[2].name, "string")
		assert.strictEqual(tokens[2].name, Token.NAME.CLOSING_TAG)

	})


	it("invalidTags", () => {

		assert.strictEqual(Tokenizer.tokenize("[u]")[0].name, Token.NAME.OPENING_TAG)
		assert.strictEqual(Tokenizer.tokenize("[u][u]")[0].name, Token.NAME.OPENING_TAG)
		assert.strictEqual(Tokenizer.tokenize("[/u]")[0].name, Token.NAME.CLOSING_TAG)
		assert.strictEqual(Tokenizer.tokenize("[/u][/u]")[0].name, Token.NAME.CLOSING_TAG)
		assert.strictEqual(Tokenizer.tokenize("[test={][/test]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Tokenizer.tokenize("[@][/@]")[0].name, Token.NAME.TEXT)

	})

	it("buffer", () => {

		assert.strictEqual(Tokenizer.tokenize("acbdef")[0].buffer, "a")
		assert.strictEqual(Tokenizer.tokenize("[b]test[/b]")[1].buffer, "t")
		assert.strictEqual(Tokenizer.tokenize("[b][i]Hello World[/i][/b]")[2].buffer, "H")
		assert.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[3].buffer, "e")
		assert.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[0].buffer, "[b]")
		assert.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[1].buffer, "[i]")
		assert.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[6].buffer, "[/b]")
		assert.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[7].buffer, "[/i]")

	})

	it("bufferIndex", () => {

		assert.strictEqual(Tokenizer.tokenize("test")[0].bufferIndex, 0)
		assert.strictEqual(Tokenizer.tokenize("test[b][/b]")[1].bufferIndex, 1)
		assert.strictEqual(Tokenizer.tokenize("test[b][/b]xoxo")[6].bufferIndex, 11)
		assert.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[2].bufferIndex, 6)
		assert.strictEqual(Tokenizer.tokenize("[b][i][e]Hello World[/e][/i][/b]")[3].bufferIndex, 9)

	})

	it("text", () => {
		const text = "This is some text"

		assert.strictEqual(Tokenizer.tokenize(text)[0].buffer, "T")
		assert.strictEqual(Tokenizer.tokenize(text)[1].buffer, "h")
		assert.strictEqual(Tokenizer.tokenize(text).length, text.length)

	})

	it("lineFeed", () => {

	assert.strictEqual(Tokenizer.tokenize("\n")[0].buffer, "\n")

	})

})
