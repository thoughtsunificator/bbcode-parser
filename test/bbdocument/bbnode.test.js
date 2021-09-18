import assert from "assert"
import { BBElement } from "../../index.js"

describe("bbtext", () => {

	it("cloneNode", () => {

		const bbElement = new BBElement("a", "1")
		bbElement.innerBBCode = "[b]Test[/b]"
		assert.strictEqual(bbElement.cloneNode().outerBBCode, "[a=1][/a]")
		assert.strictEqual(bbElement.cloneNode(true).outerBBCode, "[a=1][b]Test[/b][/a]")
		assert.notStrictEqual(bbElement.cloneNode(), bbElement)
		assert.notStrictEqual(bbElement.cloneNode(true), bbElement)

	})

	it("remove", () => {

		const bbElement = new BBElement("a", "1")
		assert.strictEqual(bbElement.innerBBCode, "")
		const b = new BBElement("b")
		bbElement.appendChild(b)
		assert.strictEqual(bbElement.innerBBCode, "[b][/b]")
		b.remove()
		assert.strictEqual(bbElement.innerBBCode, "")

	})

})
