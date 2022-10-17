
var DEBUG = false
var DEBUG_DISPLAY = false

export class Tile {
	constructor(position) {
		this.possibilities = [
			NorthToSouth, NorthToEast, NorthToWest, NorthToEastWest, NorthToSouthEastWest, NorthDeadEnd,
			SouthToEast, SouthToWest, SouthToEastWest, SouthDeadEnd,
			EastToWest, EastToNorthSouth, EastDeadEnd,
			WestToNorthSouth, WestDeadEnd,
		]
		this.position = position
	}

	get identity() {
		return `${this.position.x},${this.position.y}`
	}
	get type() {
		return `${this.possibilities.length == 1 ? "\n" + this.possibilities[0].name : "(" + this.possibilities.length + ")"}`
	}

	draw(ctx) {
		ctx.strokeStyle = "black"
		ctx.lineWidth = 1
		ctx.save()
		ctx.translate(this.position.x * Tile.bounds.width, this.position.y * Tile.bounds.height)

		if (DEBUG) {
			ctx.beginPath()
			ctx.rect(-Tile.bounds.halfwidth, -Tile.bounds.halfheight, Tile.bounds.width, Tile.bounds.height)
			ctx.stroke()
		}
		if (this.possibilities.length == 1) {
			ctx.strokeStyle = "seagreen"
			this.possibilities[0].draw(ctx, this)
		} else {
			ctx.strokeStyle = "rgb(208, 202, 140)"

			let randomPossibleTile = this.possibilities[Math.floor(Math.random() * this.possibilities.length)]
			if (randomPossibleTile) {
				randomPossibleTile.draw(ctx, this)
			}
		}

		if (DEBUG_DISPLAY) {
			ctx.textAlign = "center"
			ctx.fillStyle = "black"
			ctx.font = "12px Arial"
			ctx.fillText(this.identity, 0, 0)

			// ctx.font = "8px Arial"
			// ctx.fillText(this.type, 0, 12)

		}
		ctx.restore()
	}

	checkNeighbors(tiles) {
		// console.log(`checking neighbors of ${this.identity}`)
		let neighbors = tiles.filter((tile) => this.isNeighbor(tile))
		let collapsedTiles = neighbors.filter((tile) => tile.possibilities.length == 1)
		if (collapsedTiles.length == 0) {
			return false
		}
		let remainingPossibilities = this.possibilities
		for (let i = 0; i < collapsedTiles.length; i++) {
			let collapsedTile = collapsedTiles[i]
			const direction = this.getNeighborDirection(collapsedTile)
			if (DEBUG) {
				console.log(`${this.identity} my neighbor to the ${direction} is ${collapsedTile.possibilities[0].name}`)
			}

			let possibility = collapsedTile.possibilities[0]
			if (!possibility) {
				return false
			}

			let filteredPossibilities = remainingPossibilities.filter(poss => {
				if (!poss) {
					console.warn(`a possibility went missing in ${this.identity}`, poss)
					return false
				}
				let sockets = poss.valids[direction]
				return sockets.filter(state => {
					return possibility.valids[this.invertDirection(direction)].includes(state)
				}).length > 0
			})

			if (DEBUG) {
				console.log(`after comparing sockets, I have `, filteredPossibilities)
			}
			remainingPossibilities = filteredPossibilities
		}
		if(remainingPossibilities.length == 0) {
			console.warn("collapse put me into an impossible state", this.possibilities, neighbors)
			return false
		}
		this.possibilities = remainingPossibilities
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

	forceCollapse(impossibleToForce = [NorthDeadEnd, SouthDeadEnd, EastDeadEnd, WestDeadEnd]) {
		let validPossibilitiesToCollapseTo = this.possibilities.filter((poss) => { return !impossibleToForce.includes(poss) })
		let randomIndex = Math.floor(Math.random() * validPossibilitiesToCollapseTo.length)
		if (DEBUG) {
			console.log(`forcing collapse of ${this.identity}`, randomIndex, validPossibilitiesToCollapseTo)
		}
		this.possibilities = validPossibilitiesToCollapseTo.filter((poss) => { return !impossibleToForce.includes(poss) }).filter((poss, index) => {
			return index == randomIndex
		})
		if (DEBUG) {
			console.log(`remaining state`, this.possibilities)
		}
	}

	filterFrom(direction, state) {
		if (DEBUG) {
			console.log(`filtering out ${direction}[${state}] of ${this.identity}`)
		}
		this.possibilities = this.possibilities.filter(poss => !poss.valids[direction].includes(state))
	}
}

Tile.bounds = { width: 32, height: 32, halfwidth: 16, halfheight: 16, padding: 0 }

export class NorthToSouth { }
NorthToSouth.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, Tile.bounds.halfheight)
	ctx.stroke()
}
NorthToSouth.valids = {
	north: ["open"],
	south: ["open"],
	east: ["close"],
	west: ["close"],
}

export class NorthToEast { }
NorthToEast.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(Tile.bounds.halfwidth, 0)
	ctx.stroke()
}
NorthToEast.valids = {
	north: ["open"],
	south: ["close"],
	east: ["open"],
	west: ["close"],
}

export class NorthToWest { }
NorthToWest.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(-Tile.bounds.halfwidth, 0)
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
NorthToEastWest.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(-Tile.bounds.halfwidth, 0)
	ctx.lineTo(Tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class NorthToSouthEastWest { }
NorthToSouthEastWest.valids = {
	north: ["open"],
	south: ["open"],
	east: ["open"],
	west: ["open"],
}
NorthToSouthEastWest.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, Tile.bounds.halfheight)
	ctx.stroke()
	ctx.beginPath()
	ctx.moveTo(-Tile.bounds.halfwidth, 0)
	ctx.lineTo(Tile.bounds.halfwidth, 0)
	ctx.stroke()
}

export class NorthDeadEnd { }
NorthDeadEnd.valids = {
	north: ["open"],
	south: ["close"],
	east: ["close"],
	west: ["close"],
}
NorthDeadEnd.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(0,0, 4, 0, 2 * Math.PI)
	ctx.stroke()
}

export class SouthToEast { }
SouthToEast.valids = {
	north: ["close"],
	south: ["open"],
	east: ["open"],
	west: ["close"],
}
SouthToEast.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(Tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class SouthToWest { }
SouthToWest.valids = {
	north: ["close"],
	south: ["open"],
	east: ["close"],
	west: ["open"],
}

SouthToWest.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.lineTo(-Tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class SouthToEastWest { }
SouthToEastWest.valids = {
	north: ["close"],
	south: ["open"],
	east: ["open"],
	west: ["open"],
}

SouthToEastWest.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(-Tile.bounds.halfwidth, 0)
	ctx.lineTo(Tile.bounds.halfwidth, 0)
	ctx.stroke()
}

export class SouthDeadEnd { }
SouthDeadEnd.valids = {
	north: ["close"],
	south: ["open"],
	east: ["close"],
	west: ["close"],
}
SouthDeadEnd.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(0, Tile.bounds.halfheight)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(0,0, 4, 0, 2 * Math.PI)
	ctx.stroke()
}

export class EastToWest { }
EastToWest.valids = {
	north: ["close"],
	south: ["close"],
	east: ["open"],
	west: ["open"],
}

EastToWest.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(-Tile.bounds.halfwidth, 0)
	ctx.lineTo(Tile.bounds.halfwidth, 0)
	ctx.stroke()
}


export class EastToNorthSouth { }
EastToNorthSouth.valids = {
	north: ["open"],
	south: ["open"],
	east: ["open"],
	west: ["close"],
}

EastToNorthSouth.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(Tile.bounds.halfwidth, 0)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, Tile.bounds.halfheight)
	ctx.stroke()
}

export class EastDeadEnd { }
EastDeadEnd.valids = {
	north: ["close"],
	south: ["close"],
	east: ["open"],
	west: ["close"],
}
EastDeadEnd.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(Tile.bounds.halfwidth, 0)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(0,0, 4, 0, 2 * Math.PI)
	ctx.stroke()
}


export class WestToNorthSouth { }
WestToNorthSouth.valids = {
	north: ["open"],
	south: ["open"],
	east: ["close"],
	west: ["open"],
}

WestToNorthSouth.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(-Tile.bounds.halfwidth, 0)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(0, -Tile.bounds.halfheight)
	ctx.lineTo(0, Tile.bounds.halfheight)
	ctx.stroke()
}

export class WestDeadEnd { }
WestDeadEnd.valids = {
	north: ["close"],
	south: ["close"],
	east: ["close"],
	west: ["open"],
}
WestDeadEnd.draw = function (ctx) {
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(-Tile.bounds.halfwidth, 0)
	ctx.lineTo(0, 0)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(0,0, 4, 0, 2 * Math.PI)
	ctx.stroke()
}

