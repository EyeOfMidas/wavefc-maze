import { EastToWest, Tile } from "./tiles.js"

Array.prototype.shuffle = function() {
    let currentIndex = this.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
  }

  return this;
}

let tiles = []
let collapseSpeedMs = 0
let canvas, ctx;
let collapseTickId, animateTickId

document.addEventListener("DOMContentLoaded", () => {
	canvas = document.getElementsByTagName('canvas')[0]
	canvas.width = canvas.clientWidth
	canvas.height = canvas.clientHeight
	ctx = canvas.getContext('2d')
	ctx.width = canvas.width
	ctx.height = canvas.height

	generateTileGrid()
	// while (tiles.filter(tile => tile.possibilities.length > 1).length > 0) {
	// 	fastCollapseStep()
	// }
	collapseStep()
	animate(ctx)
})

function generateTileGrid() {
	tiles = []
	const gridMaxHeight = Math.min(30, Math.ceil(canvas.height / Tile.bounds.height) -1)
	const gridMaxWidth = Math.min(26, Math.ceil(canvas.width / Tile.bounds.width) -1)

	const startingTile = {x: 0, y: 2}
	const endingTile = {x: gridMaxWidth -1, y: gridMaxHeight-3}

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
				newTile.filterFrom("west", "open")
			}

			if(x == gridMaxWidth - 1) {
				newTile.filterFrom("east", "open")
			}

			if(y == 0) {
				newTile.filterFrom("north", "open")
			}

			if(y == gridMaxHeight - 1) {
				newTile.filterFrom("south", "open")
			}
			
		}
	}
}

function fastCollapseStep() {
	let uncollapsedTiles = tiles.filter(tile => tile.possibilities.length > 1)
	let orderedUncollapsedTiles = uncollapsedTiles.sort((a, b) => (2 * Math.random()) - 1).sort((a, b) => { return a.possibilities.length - b.possibilities.length })
		orderedUncollapsedTiles[0].forceCollapse()

		uncollapsedTiles.forEach(tile => {
			tile.checkNeighbors(tiles)
		})
}

function collapseStep() {
	if (tiles.filter(tile => tile.possibilities.length > 1).length == 0) {
		return
	}
		//need to collapse some more
		fastCollapseStep()
		collapseTickId = setTimeout(() => {
			collapseStep()
		}, collapseSpeedMs)
	}

function animate() {
	draw(ctx)
	if (tiles.filter(tile => tile.possibilities.length > 1).length == 0) {
		return
	}
	animateTickId = requestAnimationFrame(animate)
}

window.document.addEventListener("click", () => {
	cancelAnimationFrame(animateTickId)
	clearTimeout(collapseTickId)
	generateTileGrid()
	collapseStep()
	animate(ctx)
})

function draw(ctx) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.save()
	ctx.translate(Tile.bounds.halfwidth, Tile.bounds.halfheight)

	tiles.forEach(tile => {
		tile.draw(ctx)
	})
	ctx.restore()
}