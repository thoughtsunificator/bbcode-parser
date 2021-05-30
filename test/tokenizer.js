import { Token, Tokenizer } from "../index.js"

export function schema(test) {
	test.expect(30)

	const tokens = Tokenizer.tokenize("a[a*][/a*]")
	test.ok(tokens instanceof Array)
	test.strictEqual(tokens.length, 3)
	// a
	test.strictEqual(Object.keys(tokens[0]).length, 3)
	test.strictEqual(Object.hasOwnProperty.call(tokens[0], "_bufferIndex"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[0], "_buffer"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[0], "_name"), true)
	test.strictEqual(typeof tokens[0].bufferIndex, "number")
	test.strictEqual(typeof tokens[0].buffer, "string")
	test.strictEqual(typeof tokens[0].name, "string")
	test.strictEqual(tokens[0].name, Token.NAME.TEXT)
	test.strictEqual(typeof tokens[0].keys, "undefined")
	// [a*]
	test.strictEqual(Object.keys(tokens[1]).length, 4)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "_bufferIndex"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "_buffer"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "_name"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "_keys"), true)
	test.strictEqual(typeof tokens[1].bufferIndex, "number")
	test.strictEqual(typeof tokens[1].buffer, "string")
	test.strictEqual(typeof tokens[1].name, "string")
	test.ok(tokens[1].keys instanceof Array)
	test.strictEqual(tokens[1].name, Token.NAME.OPENING_TAG)
	// [/a*]
	test.strictEqual(Object.keys(tokens[2]).length, 4)
	test.strictEqual(Object.hasOwnProperty.call(tokens[2], "_bufferIndex"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[2], "_buffer"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[2], "_name"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[2], "_keys"), true)
	test.strictEqual(typeof tokens[2].bufferIndex, "number")
	test.strictEqual(typeof tokens[2].buffer, "string")
	test.strictEqual(typeof tokens[2].name, "string")
	test.strictEqual(tokens[2].name, Token.NAME.CLOSING_TAG)

	test.done()
}


export function invalidTags(test) {
	test.expect(6)

	test.strictEqual(Tokenizer.tokenize("[u]")[0].name, Token.NAME.OPENING_TAG)
	test.strictEqual(Tokenizer.tokenize("[u][u]")[0].name, Token.NAME.OPENING_TAG)
	test.strictEqual(Tokenizer.tokenize("[/u]")[0].name, Token.NAME.CLOSING_TAG)
	test.strictEqual(Tokenizer.tokenize("[/u][/u]")[0].name, Token.NAME.CLOSING_TAG)
	test.strictEqual(Tokenizer.tokenize("[test={][/test]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Tokenizer.tokenize("[@][/@]")[0].name, Token.NAME.TEXT)

	test.done()
}

export function buffer(test) {
	test.expect(8)

	test.strictEqual(Tokenizer.tokenize("acbdef")[0].buffer, "a")
	test.strictEqual(Tokenizer.tokenize("[b]test[/b]")[1].buffer, "t")
	test.strictEqual(Tokenizer.tokenize("[b][i]Hello World[/i][/b]")[2].buffer, "H")
	test.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[3].buffer, "e")
	test.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[0].buffer, "[b]")
	test.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[1].buffer, "[i]")
	test.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[6].buffer, "[/b]")
	test.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[7].buffer, "[/i]")

	test.done()
}

export function bufferIndex(test) {
	test.expect(5)

	test.strictEqual(Tokenizer.tokenize("test")[0].bufferIndex, 0)
	test.strictEqual(Tokenizer.tokenize("test[b][/b]")[1].bufferIndex, 1)
	test.strictEqual(Tokenizer.tokenize("test[b][/b]xoxo")[6].bufferIndex, 11)
	test.strictEqual(Tokenizer.tokenize("[b][i]Test[/b][/i]")[2].bufferIndex, 6)
	test.strictEqual(Tokenizer.tokenize("[b][i][e]Hello World[/e][/i][/b]")[3].bufferIndex, 9)

	test.done()
}

export function text(test) {
	test.expect(3)
	const text = "This is some text"

	test.strictEqual(Tokenizer.tokenize(text)[0].buffer, "T")
	test.strictEqual(Tokenizer.tokenize(text)[1].buffer, "h")
	test.strictEqual(Tokenizer.tokenize(text).length, text.length)

	test.done()
}

export function lineFeed(test) {
	test.expect(1)

	test.strictEqual(Tokenizer.tokenize("\n")[0].buffer, "\n")

	test.done()
}
