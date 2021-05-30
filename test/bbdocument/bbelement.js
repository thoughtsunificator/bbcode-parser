import { BBDocument, BBNode } from "../../index.js"

const bbDocument = new BBDocument()

export function appendChild(test) {
	test.expect(15)

	const bbElement = bbDocument.createElement("quote")
	const bbText = bbDocument.createTextNode("Hello World")
	const bbElement3 = bbDocument.createElement("b")
	const bbElement4 = bbDocument.createElement("i")

	bbElement.appendChild(bbText)
	bbElement.appendChild(bbElement3)
	bbElement3.appendChild(bbElement4)

	test.strictEqual(bbElement.tagName, "quote")

	test.strictEqual(bbElement.childNodes[0].nodeType, BBNode.TEXT_BBNODE)
	test.strictEqual(bbElement.childNodes[0].parentNode, bbElement)
	test.strictEqual(bbElement.childNodes[0].previousSibling, null)
	test.strictEqual(bbElement.childNodes[0].nextSibling, bbElement.childNodes[1])
	test.strictEqual(bbElement.childNodes[0].textContent, "Hello World")

	test.strictEqual(bbElement.childNodes[1].tagName, "b")
	test.strictEqual(bbElement.childNodes[1].parentNode, bbElement)
	test.strictEqual(bbElement.childNodes[1].previousSibling, bbElement.childNodes[0])
	test.strictEqual(bbElement.childNodes[1].nextSibling, null)
	test.strictEqual(bbElement.childNodes[1].nodeType, BBNode.ELEMENT_BBNODE)

	test.strictEqual(bbElement.childNodes[1].childNodes[0].tagName, "i")
	test.strictEqual(bbElement.childNodes[1].childNodes[0].parentNode, bbElement.childNodes[1])
	test.strictEqual(bbElement.childNodes[1].childNodes[0].previousSibling, null)
	test.strictEqual(bbElement.childNodes[1].childNodes[0].nextSibling, null)

	test.done()
}

export function removeChild(test) {
	test.expect(8)

	const bbElement = bbDocument.createElement("quote")
	const bbElement1 = bbDocument.createElement("s")
	const bbText = bbDocument.createTextNode("Hello World")
	const bbElement2 = bbDocument.createElement("i")
	const bbElement3 = bbDocument.createElement("d")
	bbElement.appendChild(bbElement1)
	bbElement.appendChild(bbText)
	test.ok(bbText.nextSibling === null)
	bbElement.appendChild(bbElement2)
	test.strictEqual(bbText.nextSibling.outerBBCode, bbElement2.outerBBCode)
	bbElement.appendChild(bbElement3)
	test.strictEqual(bbText.nextSibling.outerBBCode, bbElement2.outerBBCode)
	bbElement.removeChild(bbElement2)
	test.strictEqual(bbText.nextSibling.outerBBCode, bbElement3.outerBBCode)

	test.strictEqual(bbText.nextSibling.outerBBCode, bbElement3.outerBBCode)
	test.strictEqual(bbElement3.previousSibling.outerBBCode, bbText.outerBBCode)
	test.strictEqual(bbText.previousSibling.outerBBCode, bbElement1.outerBBCode)
	test.strictEqual(bbText.parentNode.childNodes[bbText.parentNode.childNodes.length - 1].outerBBCode, bbElement3.outerBBCode)

	bbElement.removeChild(bbText)
	bbElement.removeChild(bbElement2)

	test.done()
}

export function textContent(test) {
	test.expect(4)

	const bbElement = bbDocument.createElement("quote")
	const bbText = bbDocument.createTextNode("Hello World")
	const bbElement3 = bbDocument.createElement("b")
	const bbElement4 = bbDocument.createElement("i")
	bbElement.appendChild(bbText)
	bbElement.appendChild(bbElement3)
	bbElement3.appendChild(bbElement4)
	test.strictEqual(bbElement.textContent, "Hello World")
	bbElement3.textContent = "Foo"
	test.strictEqual(bbElement.textContent, "Hello WorldFoo")
	bbElement.textContent = "Hello World"
	test.strictEqual(bbElement.childNodes.length, 1)
	test.strictEqual(bbElement.childNodes[0].nodeType, BBNode.TEXT_BBNODE)

	test.done()
}

export function innerBBCode(test) {
	test.expect(9)

	const bbElement = bbDocument.createElement("s")
	const bbText = bbDocument.createTextNode("Hello World")
	const bbElement3 = bbDocument.createElement("b")
	const bbElement4 = bbDocument.createElement("i")
	bbElement.appendChild(bbText)
	bbElement.appendChild(bbElement3)
	bbElement3.appendChild(bbElement4)
	test.strictEqual(bbElement.innerBBCode, "Hello World[b][i][/i][/b]")
	bbElement.innerBBCode = "[quote=hello xzc=test]test[/quote]"
	test.strictEqual(bbElement.childNodes.length, 1)
	test.strictEqual(bbElement.childNodes[0].nodeType, BBNode.ELEMENT_BBNODE)
	test.strictEqual(bbElement.childNodes[0].keys.size, 2)
	test.strictEqual(bbElement.childNodes[0].keys.get("quote"), "hello")
	test.ok(bbElement.childNodes[0].keys.has("xzc"))
	test.strictEqual(bbElement.childNodes[0].keys.get("xzc"), "test")
	test.strictEqual(bbElement.childNodes[0].childNodes.length, 1)
	test.strictEqual(bbElement.childNodes[0].childNodes[0].nodeType, BBNode.TEXT_BBNODE)

	test.done()
}

export function outerBBCode(test) {
	test.expect(1)
	const bbElement = bbDocument.createElement("quote")
	const bbText = bbDocument.createTextNode("Hello World")
	const bbElement3 = bbDocument.createElement("b")
	const bbElement4 = bbDocument.createElement("i")
	// [quote]Hello World[b][i][/i][/b][/quote]
	bbElement.appendChild(bbText)
	bbElement.appendChild(bbElement3)
	bbElement3.appendChild(bbElement4)
	test.strictEqual(bbElement.outerBBCode, "[quote]Hello World[b][i][/i][/b][/quote]")

	test.done()
}

export function tags(test) {
	test.expect(5)

	const bbElement = bbDocument.createElement("color", "#ffffff")

	const tags = bbElement.tags()

	test.strictEqual(Object.keys(tags).length, 2)
	test.ok(Object.hasOwnProperty.call(tags, "opening"))
	test.ok(Object.hasOwnProperty.call(tags, "closing"))
	test.strictEqual(tags.opening, "[color=#ffffff]")
	test.strictEqual(tags.closing, "[/color]")

	test.done()
}

export function querySelector(test) {
	test.expect(4)

	const bbElement = bbDocument.createElement("test")
	bbElement.innerBBCode = "[v][t][/t][/v]"

	test.strictEqual(bbElement.querySelector(""), null)
	test.strictEqual(bbElement.querySelector("cxzcxz"), null)
	test.strictEqual(bbElement.querySelector("v").tagName, "v")
	test.strictEqual(bbElement.querySelector("t").tagName, "t")

	test.done()
}

export function querySelectorAll(test) {
	test.expect(3)

	const bbElement = bbDocument.createElement("test")
	bbElement.innerBBCode = "[v][t][t][v][t][/t][/v][/t][/t][/v]"

	test.strictEqual(bbElement.querySelectorAll("").length, 0)
	test.strictEqual(bbElement.querySelectorAll("vvcxv").length, 0)
	test.strictEqual(bbElement.querySelectorAll("t").length, 3)

	test.done()
}
