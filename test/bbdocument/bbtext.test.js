import { BBNode, BBText } from "../../index.js"

export function bbText(test) {
	test.expect(2)
	const bbText = new BBText("test cxz cxzdsadsa dsadsa")
	test.strictEqual(bbText.nodeType, BBNode.TEXT_BBNODE)
	test.strictEqual(bbText.textContent, "test cxz cxzdsadsa dsadsa")
	test.done()
}
