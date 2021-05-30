import { BBText, BBElement, Token, Parser, BBDocument } from "../index.js"

export function schema(test) {
	test.expect(31)

	const tokens = Parser.tokenize("a[a*][/a*]")
	test.strictEqual(tokens instanceof Array, true)
	test.strictEqual(tokens.length, 2)
	test.strictEqual(Object.keys(tokens[0]).length, 3)
	test.strictEqual(Object.hasOwnProperty.call(tokens[0], "_bufferIndex"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[0], "_buffer"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[0], "_name"), true)
	test.strictEqual(typeof tokens[0].bufferIndex, "number")
	test.strictEqual(typeof tokens[0].buffer, "string")
	test.strictEqual(typeof tokens[0].name, "string")
	test.strictEqual(tokens[0].name, Token.NAME.TEXT)
	test.strictEqual(typeof tokens[0].keys, "undefined")
	test.strictEqual(Object.keys(tokens[1]).length, 4)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "bufferIndex"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "name"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "openingTag"), true)
	test.strictEqual(Object.hasOwnProperty.call(tokens[1], "closingTag"), true)
	test.strictEqual(typeof tokens[1].bufferIndex, "number")
	test.strictEqual(typeof tokens[1].name, "string")
	test.strictEqual(tokens[1].name, "bbcode")
	test.strictEqual(typeof tokens[1].openingTag, "object")
	test.strictEqual(typeof tokens[1].openingTag.bufferIndex, "number")
	test.strictEqual(typeof tokens[1].openingTag.buffer, "string")
	test.strictEqual(typeof tokens[1].openingTag.name, "string")
	test.strictEqual(tokens[1].openingTag.name, Token.NAME.OPENING_TAG)
	test.strictEqual(tokens[1].openingTag.keys instanceof Array, true)
	test.strictEqual(typeof tokens[1].closingTag, "object")
	test.strictEqual(typeof tokens[1].closingTag.bufferIndex, "number")
	test.strictEqual(typeof tokens[1].closingTag.buffer, "string")
	test.strictEqual(typeof tokens[1].closingTag.name, "string")
	test.strictEqual(tokens[1].closingTag.name, Token.NAME.CLOSING_TAG)
	test.strictEqual(tokens[1].closingTag.keys instanceof Array, true)

	test.done()
}

export function text(test) {
	test.expect(1)

	test.strictEqual(Parser.tokenize("This is some text")[0].buffer, "This is some text")

	test.done()
}


export function invalidTags(test) {
	test.expect(7)

	test.strictEqual(Parser.tokenize("[u]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Parser.tokenize("[u][u]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Parser.tokenize("[/u]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Parser.tokenize("[/u][/u]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Parser.tokenize("[test={][/test]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Parser.tokenize("[@][/@]")[0].name, Token.NAME.TEXT)
	test.strictEqual(Parser.tokenize("[test test=1  testt=\"2\"][/test]")[0].name, Token.NAME.TEXT)

	test.done()
}

export function keys(test) {
	test.expect(8)

	test.strictEqual(Parser.tokenize("[color=#:/.rEd][/color]")[0].openingTag.keys[0].value, "#:/.rEd")
	test.strictEqual(Parser.tokenize("[list=1][/list]")[0].openingTag.keys[0].value, "1")
	test.strictEqual(Parser.tokenize("[url=http://localhost][/url]")[0].openingTag.keys[0].value, "http://localhost")
	test.strictEqual(Parser.tokenize("[url=\"http://localhost\"][/url]")[0].openingTag.keys[0].value, "http://localhost")
	test.strictEqual(Parser.tokenize("[url=\"http://localhost\"][/url]")[0].openingTag.keys[0].value, "http://localhost")
	test.strictEqual(Parser.tokenize("[test test=1][/test]")[0].openingTag.keys[1].value, "1")
	test.strictEqual(Parser.tokenize("[test test=1 testt=\"2\"]x[test]cvv[/test]xc[/test]")[0].openingTag.keys[2].name, "testt")
	test.strictEqual(Parser.tokenize("[test test=1 testt=\"2\"]test[test][test][/test][/test]sfd[/test]")[0].openingTag.keys[2].value, "2")

	test.done()
}

export function buffer(test) {
	test.expect(6)

	test.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[0].openingTag.buffer, "[b]")
	test.strictEqual(Parser.tokenize("[b][i test=1]Hello World[/i][/b]")[1].openingTag.buffer, "[i test=1]")
	test.strictEqual(Parser.tokenize("[b][i=2]Test[/b][/i]")[1].openingTag.buffer, "[i=2]")
	test.strictEqual(Parser.tokenize("[b=dsadsa test=1][i]Test[/b][/i]")[1].openingTag.buffer, "[i]")
	test.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[0].closingTag.buffer, "[/b]")
	test.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[1].closingTag.buffer, "[/i]")

	test.done()
}

export function bufferIndex(test) {
	test.expect(4)

	test.strictEqual(Parser.tokenize("test[b][/b]")[1].openingTag.bufferIndex, 4)
	test.strictEqual(Parser.tokenize("test[b][/b][test][/test]xoxo")[2].openingTag.bufferIndex, 11)
	test.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[0].closingTag.bufferIndex, 10)
	test.strictEqual(Parser.tokenize("[b][i][e]Hello World[/e][/i][/b]")[2].closingTag.bufferIndex, 20)

	test.done()
}

export function code(test) {
	test.expect(4)

	const tokens = Parser.tokenize("[code][b][/b][i][/i]Test[code]test[/code][/code][b][/b]")
	test.strictEqual(tokens.length, 3)
	test.strictEqual(tokens[0].name, "bbcode")
	test.strictEqual(tokens[1].name, Token.NAME.TEXT)
	test.strictEqual(tokens[2].name, "bbcode")

	test.done()
}

export function list(test) {
	test.expect(19)

	const tokens = Parser.tokenize("[list][*]test[*][/list]")

	test.strictEqual(tokens.length, 4)
	test.strictEqual(tokens[0].name, "bbcode")
	test.strictEqual(tokens[1].name, "bbcode")
	test.strictEqual(tokens[2].name, Token.NAME.TEXT)
	test.strictEqual(tokens[3].name, "bbcode")

	test.strictEqual(tokens[0].openingTag._buffer, "[list]")
	test.strictEqual(tokens[0].openingTag._bufferIndex, 0)
	test.strictEqual(tokens[0].closingTag._buffer, "[/list]")
	test.strictEqual(tokens[0].closingTag._bufferIndex, 16)

	test.strictEqual(tokens[1].openingTag._buffer, "[*]")
	test.strictEqual(tokens[1].openingTag._bufferIndex, 6)
	test.strictEqual(tokens[1].closingTag._buffer, "[*]")
	test.strictEqual(tokens[1].closingTag._bufferIndex, 13)

	test.strictEqual(tokens[2]._buffer, "test")
	test.strictEqual(tokens[2]._bufferIndex, 9)

	test.strictEqual(tokens[3].openingTag._buffer, "[*]")
	test.strictEqual(tokens[3].openingTag._bufferIndex, 13)
	test.strictEqual(tokens[3].closingTag._buffer, "[/list]")
	test.strictEqual(tokens[3].closingTag._bufferIndex, 16)

	test.done()
}

export function listParser(test) {
	test.expect(2)

	test.strictEqual(Parser.parse("[list][*]test[*][/list]").documentElement.childNodes[0].childNodes[0].childNodes.length, 1)
	test.strictEqual(Parser.parse("[list][*]test[*][/list]").documentElement.childNodes[0].childNodes.length, 2)


	test.done()
}

export function serialize(test) {
	test.expect(18)

	const str = "[b]Hello World[a*]Test[/a*][/b]"
	const bbDocument = Parser.parse(str)
	const bbElement = bbDocument.documentElement.childNodes[0]
	test.strictEqual(Parser.serialize(bbDocument.documentElement), str)
	test.strictEqual(Parser.serialize(new BBElement("b"), { excludeRoot: false }), "[b][/b]")
	test.strictEqual(Parser.serialize(new BBElement("b")), "")
	test.strictEqual(Parser.serialize(new BBText("b")), "b")
	test.strictEqual(Parser.serialize(Parser.parse("[t][t]test[b]x[c]e[/c][/b][t][/t]").documentElement), "[t][t]test[b]x[c]e[/c][/b][t][/t]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]test[/list]").documentElement), "[list][*]test[/list]")
	test.strictEqual(Parser.serialize(Parser.parse("[url=test]test[/url]").documentElement), "[url=test]test[/url]")
	test.strictEqual(Parser.serialize(Parser.parse("[url=test]test[url=test]test[/url][/url]").documentElement), "[url=test]test[url=test]test[/url][/url]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*][/list]").documentElement), "[list][*]test[*][/list]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*]cxcxzcxz[*]sdsadsadsa[/list]").documentElement), "[list][*]test[*]cxcxzcxz[*]sdsadsadsa[/list]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*]cxcxzcxz[*]sds[b][test]x[/test][/b]adsadsa[/list]").documentElement), "[list][*]test[*]cxcxzcxz[*]sds[b][test]x[/test][/b]adsadsa[/list]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*]cxcxzcxz[*]sds[list][*]x[*][/list][/b]adsadsa[/list]").documentElement), "[list][*]test[*]cxcxzcxz[*]sds[list][*]x[*][/list][/b]adsadsa[/list]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]1[list][*]test[/list][*]2[*]3[*]4[/list]").documentElement), "[list][*]1[list][*]test[/list][*]2[*]3[*]4[/list]")
	test.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*][/list]").documentElement, { excludeBBCode: true }), "test")
	test.strictEqual(Parser.serialize(bbDocument.documentElement, { excludeBBCode: true }), "Hello WorldTest")
	test.strictEqual(Parser.serialize(bbElement, { excludeRoot: false }), "[b]Hello World[a*]Test[/a*][/b]")
	test.strictEqual(Parser.serialize(bbElement), "Hello World[a*]Test[/a*]")
	test.strictEqual(Parser.serialize(bbDocument.documentElement, { excludeBBCode: true }), "Hello WorldTest")

	test.done()
}

export function parse(test) {
	test.expect(1)

	const bbDocument = Parser.parse("Hello World[a*]Test[/a*]")
	test.ok(bbDocument instanceof BBDocument)

	test.done()
}
