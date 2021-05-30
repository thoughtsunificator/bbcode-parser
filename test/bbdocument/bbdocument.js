import { BBDocument } from "../../index.js"

const bbDocument = new BBDocument()

export function createElement(test) {
	test.expect(1)
	const bbElement = bbDocument.createElement("b")
	test.strictEqual(bbElement.tagName, "b")
	test.done()
}

export function createTextNode(test) {
	test.expect(1)
	const bbText = bbDocument.createTextNode("Hello world")
	test.strictEqual(bbText.textContent, "Hello world")
	test.done()
}
