import assert from "assert"
import { Parser, BBDocument, TreeWalker } from "../../index.js"

describe("treewalker", () => {

	it("parentNode", () => {

		const bbDocument = new BBDocument()
		const bbElement = bbDocument.createElement("quote")
		const bbText = bbDocument.createTextNode("Hello World")
		const bbElement3 = bbDocument.createElement("b")
		const bbElement4 = bbDocument.createElement("i")
		bbElement.appendChild(bbText)
		bbElement.appendChild(bbElement3)
		bbElement3.appendChild(bbElement4)

		let treeWalker = new TreeWalker(bbElement4)
		let nodeList = []
		while(treeWalker.parentNode()) {
			nodeList.push(treeWalker.currentNode)
		}
		assert.strictEqual(nodeList.length, 2)
		assert.strictEqual(nodeList[0].outerBBCode, bbElement3.outerBBCode)
		assert.strictEqual(nodeList[1].outerBBCode, bbElement.outerBBCode)

	})

	it("nextNode", () => {

		const bbDocument = Parser.parse("[quote]1[quote]2[quote]3[quote]4[/quote]5[/quote]6[/quote]7[/quote]8[quote]9[/quote]Test")

		let treeWalker = new TreeWalker(bbDocument.documentElement)
		let nodeList = []
		while(treeWalker.nextNode()) {
			nodeList.push(treeWalker.currentNode)
		}
		assert.strictEqual(nodeList.length, 15)
		assert.strictEqual(nodeList[0].outerBBCode, "[quote]1[quote]2[quote]3[quote]4[/quote]5[/quote]6[/quote]7[/quote]")
		assert.strictEqual(nodeList[1].textContent, "1")
		assert.strictEqual(nodeList[2].outerBBCode, "[quote]2[quote]3[quote]4[/quote]5[/quote]6[/quote]")
		assert.strictEqual(nodeList[3].textContent, "2")
		assert.strictEqual(nodeList[4].outerBBCode, "[quote]3[quote]4[/quote]5[/quote]")
		assert.strictEqual(nodeList[5].textContent, "3")
		assert.strictEqual(nodeList[6].outerBBCode, "[quote]4[/quote]")
		assert.strictEqual(nodeList[7].textContent, "4")
		assert.strictEqual(nodeList[8].textContent, "5")
		assert.strictEqual(nodeList[9].textContent, "6")
		assert.strictEqual(nodeList[10].textContent, "7")
		assert.strictEqual(nodeList[11].textContent, "8")
		assert.strictEqual(nodeList[12].outerBBCode, "[quote]9[/quote]")
		assert.strictEqual(nodeList[13].textContent, "9")
		assert.strictEqual(nodeList[14].textContent, "Test")


	})

	it("nextNode_", () => {

		const bbDocument = Parser.parse("[a][b]1[c]test[/c][/b][d]2[/d][e]3[/e][f]4[/f][/a]")

		let treeWalker = new TreeWalker(bbDocument.documentElement)
		let nodeList = []
		while(treeWalker.nextNode()) {
			nodeList.push(treeWalker.currentNode)
		}
		assert.strictEqual(nodeList.length, 11)
		assert.deepEqual(nodeList.map(t => t.tagName || t.textContent), ["a", "b", "1", "c", "test", "d", "2", "e",  "3",  "f", "4"])

	})

	it("nextNode__", () => {

		const bbDocument = Parser.parse("[b][c][/c]1[/b]2[d][/d]")

		let treeWalker = new TreeWalker(bbDocument.documentElement)
		let nodeList = []
		while(treeWalker.nextNode()) {
			nodeList.push(treeWalker.currentNode)
		}
		assert.strictEqual(nodeList.length, 5)
		assert.deepEqual(nodeList.map(t => t.tagName || t.textContent), ["b", "c", "1", "2", "d"])

	})

	it("nextNode___", () => {

		const bbDocument = Parser.parse("[quote]1[quote]2[quote=test]3[quote]4[/quote]5[/quote]6[/quote]7[/quote]8[quote]9[/quote]Test")

		let treeWalker = new TreeWalker(bbDocument.documentElement)
		let nodeList = []
		while(treeWalker.nextNode()) {
			nodeList.push(treeWalker.currentNode)
		}
		assert.strictEqual(nodeList.length, 15)
		assert.deepEqual(nodeList.map(t => t.tagName || t.textContent), ["quote", "1", "quote", "2", "quote", "3", "quote", "4", "5", "6", "7", "8", "quote", "9", "Test"])

	})

	it("nextNodeList", () => {

		const bbDocument = Parser.parse("[list][*]1[list][*]test[/list][*]2[*]3[*]4[/list]")

		let treeWalker = new TreeWalker(bbDocument.documentElement)
		let nodeList = []
		while(treeWalker.nextNode()) {
			nodeList.push(treeWalker.currentNode)
		}

		assert.strictEqual(nodeList.length, 12)
		assert.deepEqual(nodeList.map(t => t.tagName || t.textContent), ["list", "*", "1", "list", "*", "test", "*", "2", "*", "3", "*", "4"])

	})

})
