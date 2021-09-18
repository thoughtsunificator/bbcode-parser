import assert from "assert"
import { Util } from "../index.js"

describe("util", () => {

	it("insertText", () => {

		assert.strictEqual("Bonjour test, comment allez-vous ?", Util.insertText("Bonjour , comment allez-vous ?", "test", 8))

	})

})
