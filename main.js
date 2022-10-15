import { EastToWest, NorthToWest, Tile } from "./tiles.js"

const tiles = []
let canvas, ctx;

document.addEventListener("DOMContentLoaded", () => {
	canvas = document.getElementsByTagName('canvas')[0]
	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight
	ctx = canvas.getContext('2d')
	ctx.width = canvas.width
	ctx.height = canvas.height

	const gridMaxHeight = Math.ceil(canvas.height / Tile.bounds.height) -1
	const gridMaxWidth = Math.ceil(canvas.width / Tile.bounds.width) -1

	const startingTile = {x: 0, y: 2}
	const endingTile = {x: gridMaxWidth -1, y: gridMaxHeight - 3}

	for (let y = 0; y < gridMaxHeight; y++) {
		for (let x = 0; x < gridMaxWidth; x++) {
			let newTile = new Tile({ x: x, y: y })
			tiles.push(newTile)

			if(x == startingTile.x && y == startingTile.y) {
				newTile.possibilities = [EastToWest]
				continue
			}

			if(x == endingTile.x && y == endingTile.y) {
				newTile.possibilities = [EastToWest]
				continue
			}
			if(x == 0) {
				newTile.possibilities = newTile.possibilities.filter(poss => !poss.valids["west"].includes("open"))
			}

			if(x == gridMaxWidth - 1) {
				newTile.possibilities = newTile.possibilities.filter(poss => !poss.valids["east"].includes("open"))
			}

			if(y == 0) {
				newTile.possibilities = newTile.possibilities.filter(poss => !poss.valids["north"].includes("open"))
			}

			if(y == gridMaxHeight - 1) {
				newTile.possibilities = newTile.possibilities.filter(poss => !poss.valids["south"].includes("open"))
			}
			
		}
	}

	collapseStep(ctx)
})

function collapseStep(ctx) {
	if (tiles.filter(tile => tile.possibilities.length > 1).length > 0) {
		//need to collapse some more
		let orderedUncollapsedTiles = tiles.filter(tile => { return tile.possibilities.length != 1 }).sort((a, b) => { return a.possibilities.length - b.possibilities.length })
		orderedUncollapsedTiles[0].forceCollapse()

		tiles.forEach(tile => {
			tile.checkNeighbors(tiles)
		})
		setTimeout(() => {
			collapseStep(ctx)
		}, 300)
	}
	draw(ctx)
}

// window.document.addEventListener("click", () => {
// 	collapseStep(ctx)
// })

function draw(ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.save()
	ctx.translate(Tile.bounds.halfwidth, Tile.bounds.halfheight)

	tiles.forEach(tile => {
		tile.draw(ctx)
	})
	ctx.restore()
}