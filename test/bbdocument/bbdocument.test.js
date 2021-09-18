import assert from "assert"
import { BBDocument } from "../../index.js"

const bbDocument = new BBDocument()

describe("bbdocument", () => {

	it("createElement", () => {

		const bbElement = bbDocument.createElement("b")
		assert.strictEqual(bbElement.tagName, "b")

	})

	it("createTextNode", () => {

		const bbText = bbDocument.createTextNode("Hello world")
		assert.strictEqual(bbText.textContent, "Hello world")

	})

})
