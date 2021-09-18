import { BBElement } from "../../index.js"

export function cloneNode(test) {
	test.expect(4)
	const bbElement = new BBElement("a", "1")
	bbElement.innerBBCode = "[b]Test[/b]"
	test.strictEqual(bbElement.cloneNode().outerBBCode, "[a=1][/a]")
	test.strictEqual(bbElement.cloneNode(true).outerBBCode, "[a=1][b]Test[/b][/a]")
	test.notStrictEqual(bbElement.cloneNode(), bbElement)
	test.notStrictEqual(bbElement.cloneNode(true), bbElement)
	test.done()
}

export function remove(test) {
	test.expect(3)
	const bbElement = new BBElement("a", "1")
	test.strictEqual(bbElement.innerBBCode, "")
	const b = new BBElement("b")
	bbElement.appendChild(b)
	test.strictEqual(bbElement.innerBBCode, "[b][/b]")
	b.remove()
	test.strictEqual(bbElement.innerBBCode, "")
	test.done()
}
