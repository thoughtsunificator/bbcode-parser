import { Util } from "../index.js"

export function insertText(test) {
	test.expect(1)

	test.strictEqual("Bonjour test, comment allez-vous ?", Util.insertText("Bonjour , comment allez-vous ?", "test", 8))

	test.done()
}
