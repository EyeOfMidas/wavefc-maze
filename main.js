import { NorthToWest, Tile } from "./tiles.js"

const tiles = []

document.addEventListener("DOMContentLoaded", () => {
	for(let y = 0; y < 10; y++) {
		for(let x = 0; x < 10; x ++) {
			tiles.push(new Tile({x: x, y: y}))
		}
	}

	const canvas = document.getElementsByTagName('canvas')[0]
	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight
	const ctx = canvas.getContext('2d')
	ctx.width = canvas.width
	ctx.height = canvas.height

	const seed = tiles[45]
	seed.possibilities = [seed.possibilities[Math.floor(Math.random() * seed.possibilities.length)]]
	seed.checkNeighbors(tiles)

	let didCollapse = false
	tiles.forEach(tile => {
		didCollapse &= tile.checkNeighbors(tiles)
	})

	draw(ctx)


	if(!didCollapse) {
		console.log("nothing resolved, picking random")
		let orderedUncollapsedTiles = tiles.filter(tile => {return tile.possibilities.length != 1}).sort((a, b) => {return a.possibilities.length - b.possibilities.length})
		let seed = orderedUncollapsedTiles[0]
		seed.possibilities = [seed.possibilities[Math.floor(Math.random() * seed.possibilities.length)]]
		seed.checkNeighbors(tiles)

		draw(ctx)
	}
})

function draw(ctx) {
	ctx.clearRect(0,0, 644, 644)
	ctx.save()
	ctx.translate(34,34)

	tiles.forEach(tile => {
		tile.draw(ctx)
	})
	ctx.restore()
}