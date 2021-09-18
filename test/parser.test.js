import assert from "assert"
import { BBText, BBElement, Token, Parser, BBDocument } from "../index.js"

describe("parser", () => {

	it("schema", () => {

		const tokens = Parser.tokenize("a[a*][/a*]")
		assert.strictEqual(tokens instanceof Array, true)
		assert.strictEqual(tokens.length, 2)
		assert.strictEqual(Object.keys(tokens[0]).length, 3)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[0], "_bufferIndex"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[0], "_buffer"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[0], "_name"), true)
		assert.strictEqual(typeof tokens[0].bufferIndex, "number")
		assert.strictEqual(typeof tokens[0].buffer, "string")
		assert.strictEqual(typeof tokens[0].name, "string")
		assert.strictEqual(tokens[0].name, Token.NAME.TEXT)
		assert.strictEqual(typeof tokens[0].keys, "undefined")
		assert.strictEqual(Object.keys(tokens[1]).length, 4)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "bufferIndex"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "name"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "openingTag"), true)
		assert.strictEqual(Object.hasOwnProperty.call(tokens[1], "closingTag"), true)
		assert.strictEqual(typeof tokens[1].bufferIndex, "number")
		assert.strictEqual(typeof tokens[1].name, "string")
		assert.strictEqual(tokens[1].name, "bbcode")
		assert.strictEqual(typeof tokens[1].openingTag, "object")
		assert.strictEqual(typeof tokens[1].openingTag.bufferIndex, "number")
		assert.strictEqual(typeof tokens[1].openingTag.buffer, "string")
		assert.strictEqual(typeof tokens[1].openingTag.name, "string")
		assert.strictEqual(tokens[1].openingTag.name, Token.NAME.OPENING_TAG)
		assert.strictEqual(tokens[1].openingTag.keys instanceof Array, true)
		assert.strictEqual(typeof tokens[1].closingTag, "object")
		assert.strictEqual(typeof tokens[1].closingTag.bufferIndex, "number")
		assert.strictEqual(typeof tokens[1].closingTag.buffer, "string")
		assert.strictEqual(typeof tokens[1].closingTag.name, "string")
		assert.strictEqual(tokens[1].closingTag.name, Token.NAME.CLOSING_TAG)
		assert.strictEqual(tokens[1].closingTag.keys instanceof Array, true)

	})

	it("text", () => {

		assert.strictEqual(Parser.tokenize("This is some text")[0].buffer, "This is some text")

	})


	it("invalidTags", () => {

		assert.strictEqual(Parser.tokenize("[u]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Parser.tokenize("[u][u]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Parser.tokenize("[/u]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Parser.tokenize("[/u][/u]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Parser.tokenize("[test={][/test]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Parser.tokenize("[@][/@]")[0].name, Token.NAME.TEXT)
		assert.strictEqual(Parser.tokenize("[test test=1  testt=\"2\"][/test]")[0].name, Token.NAME.TEXT)

	})

	it("keys", () => {

		assert.strictEqual(Parser.tokenize("[color=#:/.rEd][/color]")[0].openingTag.keys[0].value, "#:/.rEd")
		assert.strictEqual(Parser.tokenize("[list=1][/list]")[0].openingTag.keys[0].value, "1")
		assert.strictEqual(Parser.tokenize("[url=http://localhost][/url]")[0].openingTag.keys[0].value, "http://localhost")
		assert.strictEqual(Parser.tokenize("[url=\"http://localhost\"][/url]")[0].openingTag.keys[0].value, "http://localhost")
		assert.strictEqual(Parser.tokenize("[url=\"http://localhost\"][/url]")[0].openingTag.keys[0].value, "http://localhost")
		assert.strictEqual(Parser.tokenize("[test test=1][/test]")[0].openingTag.keys[1].value, "1")
		assert.strictEqual(Parser.tokenize("[test test=1 testt=\"2\"]x[test]cvv[/test]xc[/test]")[0].openingTag.keys[2].name, "testt")
		assert.strictEqual(Parser.tokenize("[test test=1 testt=\"2\"]test[test][test][/test][/test]sfd[/test]")[0].openingTag.keys[2].value, "2")

	})

	it("buffer", () => {

		assert.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[0].openingTag.buffer, "[b]")
		assert.strictEqual(Parser.tokenize("[b][i test=1]Hello World[/i][/b]")[1].openingTag.buffer, "[i test=1]")
		assert.strictEqual(Parser.tokenize("[b][i=2]Test[/b][/i]")[1].openingTag.buffer, "[i=2]")
		assert.strictEqual(Parser.tokenize("[b=dsadsa test=1][i]Test[/b][/i]")[1].openingTag.buffer, "[i]")
		assert.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[0].closingTag.buffer, "[/b]")
		assert.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[1].closingTag.buffer, "[/i]")

	})

	it("bufferIndex", () => {

		assert.strictEqual(Parser.tokenize("test[b][/b]")[1].openingTag.bufferIndex, 4)
		assert.strictEqual(Parser.tokenize("test[b][/b][test][/test]xoxo")[2].openingTag.bufferIndex, 11)
		assert.strictEqual(Parser.tokenize("[b][i]Test[/b][/i]")[0].closingTag.bufferIndex, 10)
		assert.strictEqual(Parser.tokenize("[b][i][e]Hello World[/e][/i][/b]")[2].closingTag.bufferIndex, 20)

	})

	it("code", () => {

		const tokens = Parser.tokenize("[code][b][/b][i][/i]Test[code]test[/code][/code][b][/b]")
		assert.strictEqual(tokens.length, 3)
		assert.strictEqual(tokens[0].name, "bbcode")
		assert.strictEqual(tokens[1].name, Token.NAME.TEXT)
		assert.strictEqual(tokens[2].name, "bbcode")

	})

	it("list", () => {

		const tokens = Parser.tokenize("[list][*]test[*][/list]")

		assert.strictEqual(tokens.length, 4)
		assert.strictEqual(tokens[0].name, "bbcode")
		assert.strictEqual(tokens[1].name, "bbcode")
		assert.strictEqual(tokens[2].name, Token.NAME.TEXT)
		assert.strictEqual(tokens[3].name, "bbcode")

		assert.strictEqual(tokens[0].openingTag._buffer, "[list]")
		assert.strictEqual(tokens[0].openingTag._bufferIndex, 0)
		assert.strictEqual(tokens[0].closingTag._buffer, "[/list]")
		assert.strictEqual(tokens[0].closingTag._bufferIndex, 16)

		assert.strictEqual(tokens[1].openingTag._buffer, "[*]")
		assert.strictEqual(tokens[1].openingTag._bufferIndex, 6)
		assert.strictEqual(tokens[1].closingTag._buffer, "[*]")
		assert.strictEqual(tokens[1].closingTag._bufferIndex, 13)

		assert.strictEqual(tokens[2]._buffer, "test")
		assert.strictEqual(tokens[2]._bufferIndex, 9)

		assert.strictEqual(tokens[3].openingTag._buffer, "[*]")
		assert.strictEqual(tokens[3].openingTag._bufferIndex, 13)
		assert.strictEqual(tokens[3].closingTag._buffer, "[/list]")
		assert.strictEqual(tokens[3].closingTag._bufferIndex, 16)

	})

	it("listParser", () => {

		assert.strictEqual(Parser.parse("[list][*]test[*][/list]").documentElement.childNodes[0].childNodes[0].childNodes.length, 1)
		assert.strictEqual(Parser.parse("[list][*]test[*][/list]").documentElement.childNodes[0].childNodes.length, 2)

	})

	it("serialize", () => {

		const str = "[b]Hello World[a*]Test[/a*][/b]"
		const bbDocument = Parser.parse(str)
		const bbElement = bbDocument.documentElement.childNodes[0]
		assert.strictEqual(Parser.serialize(bbDocument.documentElement), str)
		assert.strictEqual(Parser.serialize(new BBElement("b"), { excludeRoot: false }), "[b][/b]")
		assert.strictEqual(Parser.serialize(new BBElement("b")), "")
		assert.strictEqual(Parser.serialize(new BBText("b")), "b")
		assert.strictEqual(Parser.serialize(Parser.parse("[t][t]test[b]x[c]e[/c][/b][t][/t]").documentElement), "[t][t]test[b]x[c]e[/c][/b][t][/t]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]test[/list]").documentElement), "[list][*]test[/list]")
		assert.strictEqual(Parser.serialize(Parser.parse("[url=test]test[/url]").documentElement), "[url=test]test[/url]")
		assert.strictEqual(Parser.serialize(Parser.parse("[url=test]test[url=test]test[/url][/url]").documentElement), "[url=test]test[url=test]test[/url][/url]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*][/list]").documentElement), "[list][*]test[*][/list]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*]cxcxzcxz[*]sdsadsadsa[/list]").documentElement), "[list][*]test[*]cxcxzcxz[*]sdsadsadsa[/list]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*]cxcxzcxz[*]sds[b][test]x[/test][/b]adsadsa[/list]").documentElement), "[list][*]test[*]cxcxzcxz[*]sds[b][test]x[/test][/b]adsadsa[/list]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*]cxcxzcxz[*]sds[list][*]x[*][/list][/b]adsadsa[/list]").documentElement), "[list][*]test[*]cxcxzcxz[*]sds[list][*]x[*][/list][/b]adsadsa[/list]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]1[list][*]test[/list][*]2[*]3[*]4[/list]").documentElement), "[list][*]1[list][*]test[/list][*]2[*]3[*]4[/list]")
		assert.strictEqual(Parser.serialize(Parser.parse("[list][*]test[*][/list]").documentElement, { excludeBBCode: true }), "test")
		assert.strictEqual(Parser.serialize(bbDocument.documentElement, { excludeBBCode: true }), "Hello WorldTest")
		assert.strictEqual(Parser.serialize(bbElement, { excludeRoot: false }), "[b]Hello World[a*]Test[/a*][/b]")
		assert.strictEqual(Parser.serialize(bbElement), "Hello World[a*]Test[/a*]")
		assert.strictEqual(Parser.serialize(bbDocument.documentElement, { excludeBBCode: true }), "Hello WorldTest")

	})

	it("parse", () => {

		const bbDocument = Parser.parse("Hello World[a*]Test[/a*]")
		assert.ok(bbDocument instanceof BBDocument)

	})

})
