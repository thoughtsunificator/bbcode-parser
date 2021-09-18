import assert from "assert"
import { BBDocument, BBNode } from "../../index.js"

const bbDocument = new BBDocument()

describe("bbelement", () => {

	it("appendChild", () => {

		const bbElement = bbDocument.createElement("quote")
		const bbText = bbDocument.createTextNode("Hello World")
		const bbElement3 = bbDocument.createElement("b")
		const bbElement4 = bbDocument.createElement("i")

		bbElement.appendChild(bbText)
		bbElement.appendChild(bbElement3)
		bbElement3.appendChild(bbElement4)

		assert.strictEqual(bbElement.tagName, "quote")

		assert.strictEqual(bbElement.childNodes[0].nodeType, BBNode.TEXT_BBNODE)
		assert.strictEqual(bbElement.childNodes[0].parentNode, bbElement)
		assert.strictEqual(bbElement.childNodes[0].previousSibling, null)
		assert.strictEqual(bbElement.childNodes[0].nextSibling, bbElement.childNodes[1])
		assert.strictEqual(bbElement.childNodes[0].textContent, "Hello World")

		assert.strictEqual(bbElement.childNodes[1].tagName, "b")
		assert.strictEqual(bbElement.childNodes[1].parentNode, bbElement)
		assert.strictEqual(bbElement.childNodes[1].previousSibling, bbElement.childNodes[0])
		assert.strictEqual(bbElement.childNodes[1].nextSibling, null)
		assert.strictEqual(bbElement.childNodes[1].nodeType, BBNode.ELEMENT_BBNODE)

		assert.strictEqual(bbElement.childNodes[1].childNodes[0].tagName, "i")
		assert.strictEqual(bbElement.childNodes[1].childNodes[0].parentNode, bbElement.childNodes[1])
		assert.strictEqual(bbElement.childNodes[1].childNodes[0].previousSibling, null)
		assert.strictEqual(bbElement.childNodes[1].childNodes[0].nextSibling, null)

	})

	it("removeChild", () => {

		const bbElement = bbDocument.createElement("quote")
		const bbElement1 = bbDocument.createElement("s")
		const bbText = bbDocument.createTextNode("Hello World")
		const bbElement2 = bbDocument.createElement("i")
		const bbElement3 = bbDocument.createElement("d")
		bbElement.appendChild(bbElement1)
		bbElement.appendChild(bbText)
		assert.ok(bbText.nextSibling === null)
		bbElement.appendChild(bbElement2)
		assert.strictEqual(bbText.nextSibling.outerBBCode, bbElement2.outerBBCode)
		bbElement.appendChild(bbElement3)
		assert.strictEqual(bbText.nextSibling.outerBBCode, bbElement2.outerBBCode)
		bbElement.removeChild(bbElement2)
		assert.strictEqual(bbText.nextSibling.outerBBCode, bbElement3.outerBBCode)

		assert.strictEqual(bbText.nextSibling.outerBBCode, bbElement3.outerBBCode)
		assert.strictEqual(bbElement3.previousSibling.outerBBCode, bbText.outerBBCode)
		assert.strictEqual(bbText.previousSibling.outerBBCode, bbElement1.outerBBCode)
		assert.strictEqual(bbText.parentNode.childNodes[bbText.parentNode.childNodes.length - 1].outerBBCode, bbElement3.outerBBCode)

		bbElement.removeChild(bbText)
		bbElement.removeChild(bbElement2)

	})

	it("textContent", () => {

		const bbElement = bbDocument.createElement("quote")
		const bbText = bbDocument.createTextNode("Hello World")
		const bbElement3 = bbDocument.createElement("b")
		const bbElement4 = bbDocument.createElement("i")
		bbElement.appendChild(bbText)
		bbElement.appendChild(bbElement3)
		bbElement3.appendChild(bbElement4)
		assert.strictEqual(bbElement.textContent, "Hello World")
		bbElement3.textContent = "Foo"
		assert.strictEqual(bbElement.textContent, "Hello WorldFoo")
		bbElement.textContent = "Hello World"
		assert.strictEqual(bbElement.childNodes.length, 1)
		assert.strictEqual(bbElement.childNodes[0].nodeType, BBNode.TEXT_BBNODE)

	})

	it("innerBBCode", () => {

		const bbElement = bbDocument.createElement("s")
		const bbText = bbDocument.createTextNode("Hello World")
		const bbElement3 = bbDocument.createElement("b")
		const bbElement4 = bbDocument.createElement("i")
		bbElement.appendChild(bbText)
		bbElement.appendChild(bbElement3)
		bbElement3.appendChild(bbElement4)
		assert.strictEqual(bbElement.innerBBCode, "Hello World[b][i][/i][/b]")
		bbElement.innerBBCode = "[quote=hello xzc=test]test[/quote]"
		assert.strictEqual(bbElement.childNodes.length, 1)
		assert.strictEqual(bbElement.childNodes[0].nodeType, BBNode.ELEMENT_BBNODE)
		assert.strictEqual(bbElement.childNodes[0].keys.size, 2)
		assert.strictEqual(bbElement.childNodes[0].keys.get("quote"), "hello")
		assert.ok(bbElement.childNodes[0].keys.has("xzc"))
		assert.strictEqual(bbElement.childNodes[0].keys.get("xzc"), "test")
		assert.strictEqual(bbElement.childNodes[0].childNodes.length, 1)
		assert.strictEqual(bbElement.childNodes[0].childNodes[0].nodeType, BBNode.TEXT_BBNODE)

	})

	it("outerBBCode", () => {
			const bbElement = bbDocument.createElement("quote")
		const bbText = bbDocument.createTextNode("Hello World")
		const bbElement3 = bbDocument.createElement("b")
		const bbElement4 = bbDocument.createElement("i")
		// [quote]Hello World[b][i][/i][/b][/quote]
		bbElement.appendChild(bbText)
		bbElement.appendChild(bbElement3)
		bbElement3.appendChild(bbElement4)
		assert.strictEqual(bbElement.outerBBCode, "[quote]Hello World[b][i][/i][/b][/quote]")

	})

	it("tags", () => {

		const bbElement = bbDocument.createElement("color", "#ffffff")

		const tags = bbElement.tags()

		assert.strictEqual(Object.keys(tags).length, 2)
		assert.ok(Object.hasOwnProperty.call(tags, "opening"))
		assert.ok(Object.hasOwnProperty.call(tags, "closing"))
		assert.strictEqual(tags.opening, "[color=#ffffff]")
		assert.strictEqual(tags.closing, "[/color]")

	})

	it("querySelector", () => {

		const bbElement = bbDocument.createElement("test")
		bbElement.innerBBCode = "[v][t][/t][/v]"

		assert.strictEqual(bbElement.querySelector(""), null)
		assert.strictEqual(bbElement.querySelector("cxzcxz"), null)
		assert.strictEqual(bbElement.querySelector("v").tagName, "v")
		assert.strictEqual(bbElement.querySelector("t").tagName, "t")

	})

	it("querySelectorAll", () => {

		const bbElement = bbDocument.createElement("test")
		bbElement.innerBBCode = "[v][t][t][v][t][/t][/v][/t][/t][/v]"

		assert.strictEqual(bbElement.querySelectorAll("").length, 0)
		assert.strictEqual(bbElement.querySelectorAll("vvcxv").length, 0)
		assert.strictEqual(bbElement.querySelectorAll("t").length, 3)

	})

})
