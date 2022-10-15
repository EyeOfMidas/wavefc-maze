import { Tile } from "./tiles.js"

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

	tiles.forEach(tile => {
		tile.checkNeighbors(tiles)
	})

	draw(ctx)
})

function draw(ctx) {
	ctx.save()
	ctx.translate(34,34)

	tiles.forEach(tile => {
		tile.draw(ctx)
	})
	ctx.restore()
}