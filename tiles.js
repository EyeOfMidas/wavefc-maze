
export class Tile {
	constructor(position) {
		this.bounds = {width: 64, height: 64, halfwidth: 32, halfheight: 32}
		this.possibilities = [
			NorthToSouth, NorthToEast, NorthToWest, NorthToEastWest,
			NorthToSouthEastWest, SouthToEast, SouthToWest, SouthToEastWest,
			EastToWest, EastToNorthSouth, WestToNorthSouth
		]
		this.position = position
		this.collapsed = null
	}

	draw(ctx) {
		ctx.strokeStyle = "black"
		ctx.lineWidth = 4
		ctx.save()
		ctx.translate(this.position.x * this.bounds.width, this.position.y * this.bounds.height)
		ctx.beginPath()
		ctx.rect(-this.bounds.halfwidth, -this.bounds.halfheight, this.bounds.width, this.bounds.height)
		ctx.stroke()
		if(this.collapsed) {
			this.collapsed.draw(ctx, this)
		}
		
		ctx.restore()
	}

	checkNeighbors(tiles) {
		
		let neighbors = tiles.filter((tile) => this.isNeighbor(tile))
		let decidedTiles = neighbors.filter((tile) => tile.possibilities.length == 1)
		if(decidedTiles.length > 0) {
			console.log(`Checking tile ${this.position.x}, ${this.position.y}`)
			console.log(decidedTiles)
		}

		if(this.possibilities.length == 1) {
			this.collapsed = new (this.possibilities[0])()
		}
		
	}

	isNeighbor(tile) {
		if(this.position.x - 1 == tile.position.x && this.position.y == tile.position.y) { //to the west
			return true
		}

		if(this.position.x + 1 == tile.position.x && this.position.y == tile.position.y) { //to the east
			return true
		}

		if(this.position.x == tile.position.x && this.position.y - 1 == tile.position.y) { //to the north
			return true
		}

		if(this.position.x == tile.position.x && this.position.y + 1 == tile.position.y) { //to the south
			return true
		}

		return false
	}
}

export class NorthToSouth{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["open"],
			east: ["close"],
			west: ["close"],
		}
	}

	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, tile.bounds.halfheight)
		ctx.stroke()
	}
}

export class NorthToEast{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["close"],
			east: ["open"],
			west: ["close"],
		}
	}

	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, 0)
		ctx.lineTo(tile.bounds.halfwidth, 0)
		ctx.stroke()
	}	
}

export class NorthToWest{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["close"],
			east: ["close"],
			west: ["open"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, 0)
		ctx.lineTo(-tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class NorthToEastWest{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["close"],
			east: ["open"],
			west: ["open"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, 0)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(-tile.bounds.halfwidth,0)
		ctx.lineTo(tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class NorthToSouthEastWest{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["open"],
			east: ["open"],
			west: ["open"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, tile.bounds.halfheight)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(-tile.bounds.halfwidth, 0)
		ctx.lineTo(tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class SouthToEast{
	constructor() {
		this.valids = {
			north: ["close"],
			south: ["open"],
			east: ["open"],
			west: ["close"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, tile.bounds.halfheight)
		ctx.lineTo(0, 0)
		ctx.lineTo(tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class SouthToWest{
	constructor() {
		this.valids = {
			north: ["close"],
			south: ["open"],
			east: ["open"],
			west: ["close"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, tile.bounds.halfheight)
		ctx.lineTo(0, 0)
		ctx.lineTo(-tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class SouthToEastWest{
	constructor() {
		this.valids = {
			north: ["close"],
			south: ["open"],
			east: ["open"],
			west: ["open"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(0, tile.bounds.halfheight)
		ctx.lineTo(0, 0)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(-tile.bounds.halfwidth, 0)
		ctx.lineTo(tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class EastToWest{
	constructor() {
		this.valids = {
			north: ["close"],
			south: ["close"],
			east: ["open"],
			west: ["open"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(-tile.bounds.halfwidth, 0)
		ctx.lineTo(tile.bounds.halfwidth, 0)
		ctx.stroke()
	}
}

export class EastToNorthSouth{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["open"],
			east: ["open"],
			west: ["close"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(tile.bounds.halfwidth, 0)
		ctx.lineTo(0, 0)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, tile.bounds.halfheight)
		ctx.stroke()
	}
}

export class WestToNorthSouth{
	constructor() {
		this.valids = {
			north: ["open"],
			south: ["open"],
			east: ["close"],
			west: ["open"],
		}
	}
	draw(ctx, tile) {
		ctx.strokeStyle = "seagreen"
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(-tile.bounds.halfwidth, 0)
		ctx.lineTo(0, 0)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(0, -tile.bounds.halfheight)
		ctx.lineTo(0, tile.bounds.halfheight)
		ctx.stroke()
	}
}
