import assert from "assert"
import { BBNode, BBText } from "../../index.js"

describe("bbtext", () => {

	it("bbText", () => {

		const bbText = new BBText("test cxz cxzdsadsa dsadsa")
		assert.strictEqual(bbText.nodeType, BBNode.TEXT_BBNODE)
		assert.strictEqual(bbText.textContent, "test cxz cxzdsadsa dsadsa")

	})

})
