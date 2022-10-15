
export class Tile {
	constructor(position) {
		this.bounds = { width: 64, height: 64, halfwidth: 32, halfheight: 32 }
		this.possibilities = [
			NorthToSouth, NorthToEast, NorthToWest, NorthToEastWest,
			NorthToSouthEastWest, SouthToEast, SouthToWest, SouthToEastWest,
			EastToWest, EastToNorthSouth, WestToNorthSouth
		]
		this.position = position
		this.collapsed = null
	}

	get identity() {
		return `${this.position.x},${this.position.y}`
	}
	get type() {
		return `${this.possibilities.length == 1 ? "\n" + this.possibilities[0].name : "(" + this.possibilities.length +")"}`
	}

	draw(ctx) {
		ctx.strokeStyle = "black"
		ctx.lineWidth = 4
		ctx.save()
		ctx.translate(this.position.x * this.bounds.width, this.position.y * this.bounds.height)
		
		ctx.beginPath()
		ctx.rect(-this.bounds.halfwidth, -this.bounds.halfheight, this.bounds.width, this.bounds.height)
		ctx.stroke()
		if (this.collapsed) {
			this.collapsed.draw(ctx, this)
		}

		ctx.textAlign = "center"
		ctx.fillStyle = "black"
		ctx.font = "12px Arial"
		ctx.fillText(this.identity, 0, 0)

		ctx.font = "8px Arial"
		ctx.fillText(this.type, 0, 12)
		ctx.restore()
	}

	checkNeighbors(tiles) {

		let neighbors = tiles.filter((tile) => this.isNeighbor(tile))
		let collapsedTiles = neighbors.filter((tile) => tile.possibilities.length == 1)
		if (collapsedTiles.length > 0) {
			collapsedTiles.forEach((collapsedTile) => {
				const direction = this.getNeighborDirection(collapsedTile)
				console.log(`${this.identity} my neighbor to the ${direction} is ${collapsedTile.possibilities[0].name}`)


				let filteredPossibilities = this.possibilities.filter(poss => {
					return poss.valids[direction].filter(state => {
						return collapsedTile.possibilities[0].valids[this.invertDirection(direction)].includes(state)
					}).length > 0
				})

				// let filteredPossibilities = this.possibilities.filter((possibility) =>  {
				// 	return collapsedTile.collapsed.valids[this.invertDirection(direction)].filter(state => {
				// 		return possibility.valids[direction].includes(state)
				// 	}).length > 0
				// })
				console.log(`after comparing sockets, I have `, filteredPossibilities)
				this.possibilities = filteredPossibilities
			})
		}
		
		if (this.possibilities.length == 1) {
			this.collapsed = this.possibilities[0]
		}

	}

	invertDirection(direction) {
		return { north: "south", south: "north", east: "west", west: "east" }[direction]
	}

	getNeighborDirection(tile) {
		if (this.position.x - 1 == tile.position.x && this.position.y == tile.position.y) { //to the west
			return "west"
		}

		if (this.position.x + 1 == tile.position.x && this.position.y == tile.position.y) { //to the east
			return "east"
		}

		if (this.position.x == tile.position.x && this.position.y - 1 == tile.position.y) { //to the north
			return "north"
		}

		if (this.position.x == tile.position.x && this.position.y + 1 == tile.position.y) { //to the south
			return "south"
		}
		return null
	}

	isNeighbor(tile) {
		return this.getNeighborDirection(tile) != null
	}
}

export class NorthToSouth { }
NorthToSouth.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -tile.bounds.halfheight)
	ctx.lineTo(0, tile.bounds.halfheight)
	ctx.stroke()
}
NorthToSouth.valids = {
	north: ["open"],
	south: ["open"],
	east: ["close"],
	west: ["close"],
}

export class NorthToEast { }
NorthToEast.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(tile.bounds.halfwidth, 0)
	ctx.stroke()
}
NorthToEast.valids = {
	north: ["open"],
	south: ["close"],
	east: ["open"],
	west: ["close"],
}

export class NorthToWest { }
NorthToWest.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(-tile.bounds.halfwidth, 0)
	ctx.stroke()
}

NorthToWest.valids = {
	north: ["open"],
	south: ["close"],
	east: ["close"],
	west: ["open"],
}

export class NorthToEastWest { }
NorthToEastWest.valids = {
	north: ["open"],
	south: ["close"],
	east: ["open"],
	west: ["open"],
}
NorthToEastWest.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(-tile.bounds.halfwidth, 0)
	ctx.lineTo(tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class NorthToSouthEastWest { }
NorthToSouthEastWest.valids = {
	north: ["open"],
	south: ["open"],
	east: ["open"],
	west: ["open"],
}
NorthToSouthEastWest.draw = function (ctx, tile) {
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

export class SouthToEast { }
SouthToEast.valids = {
	north: ["close"],
	south: ["open"],
	east: ["open"],
	west: ["close"],
}
SouthToEast.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class SouthToWest { }
SouthToWest.valids = {
	north: ["close"],
	south: ["open"],
	east: ["close"],
	west: ["open"],
}

SouthToWest.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(-tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class SouthToEastWest { }
SouthToEastWest.valids = {
	north: ["close"],
	south: ["open"],
	east: ["open"],
	west: ["open"],
}

SouthToEastWest.draw = function (ctx, tile) {
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


export class EastToWest { }
EastToWest.valids = {
	north: ["close"],
	south: ["close"],
	east: ["open"],
	west: ["open"],
}

EastToWest.draw = function (ctx, tile) {
	ctx.strokeStyle = "seagreen"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(-tile.bounds.halfwidth, 0)
	ctx.lineTo(tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class EastToNorthSouth { }
EastToNorthSouth.valids = {
	north: ["open"],
	south: ["open"],
	east: ["open"],
	west: ["close"],
}

EastToNorthSouth.draw = function (ctx, tile) {
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


export class WestToNorthSouth { }
WestToNorthSouth.valids = {
	north: ["open"],
	south: ["open"],
	east: ["close"],
	west: ["open"],
}

WestToNorthSouth.draw = function (ctx, tile) {
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

