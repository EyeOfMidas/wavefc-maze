
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

		ctx.restore()
	}

	checkNeighbors(tiles) {

		let neighbors = tiles.filter((tile) => this.isNeighbor(tile))
		let decidedTiles = neighbors.filter((tile) => tile.possibilities.length == 1)
		if (decidedTiles.length > 0) {
			decidedTiles.forEach((tile) => {
				const direction = this.getNeighborDirection(tile)
				this.possibilities = this.possibilities.filter((possibility) =>  {
					return tile.collapsed.valids[direction].filter(state => {
						return possibility.valids[this.invertDirection(direction)].includes(state)
					}).length > 0
				})
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
	east: ["open"],
	west: ["close"],
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

