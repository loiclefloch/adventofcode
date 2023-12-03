const fs = require("fs")

const Color = {
	RED: 'red',
	BLUE: 'blue',
	GREEN: 'green'
}

function getAllForColor(reveals, color) {
	return reveals.flat()
		.filter(data => data.color === color)
		.map(data => data.nb)
}

function getMin(reveals, color) {
	const allForColor = getAllForColor(reveals, color)
	return Math.min(...allForColor)
}

function getMax(reveals, color) {
	const allForColor = getAllForColor(reveals, color)
	return Math.max(...allForColor)
}

function getColorsData(reveals) {
	return {
		[Color.RED]: {
			min: getMin(reveals, Color.RED),
			max: getMax(reveals, Color.RED),
		},
		[Color.BLUE]: {
			min: getMin(reveals, Color.BLUE),
			max: getMax(reveals, Color.BLUE),
		},
		[Color.GREEN]: {
			min: getMin(reveals, Color.GREEN),
			max: getMax(reveals, Color.GREEN),
		},
	}
}

function parseData(data) {
	const gamesData = data.map(line => {
		const gameStr = line.split(": ")[0]
		const gameIndex = parseInt(gameStr.replace("Game ", ""))

		const reveals = line.split(": ")[1].split(";")
			.map(revealStr => {
				return revealStr.trim().split(", ")
					.map(revealStr => {
						const splitted = revealStr.split(" ")
						return {
							color: splitted[1],
							nb: parseInt(splitted[0])
						}
					})
			})

		return {
			gameIndex,
			reveals,
			...getColorsData(reveals)
		}
	})
	return gamesData
}

function main() {
  const data = fs.readFileSync("./input", "utf8").split("\n")
	const gamesData = parseData(data)

	// part 1
	const matchingGameIndexes = gamesData
		.filter(gameData => gameData.red.max <= 12 && gameData.green.max <= 13 && gameData.blue.max <= 14)
		.map(gameData => gameData.gameIndex)
	const part1Total = matchingGameIndexes.reduce((acc, gameIndex) => gameIndex + acc, 0)
	console.log(part1Total)

	// part 2
	gamesData.forEach(game => {
		game.powers = game.red.max * game.green.max * game.blue.max
	});
	const part2Total = gamesData.reduce((acc, game) => game.powers + acc, 0)

	console.log(gamesData)

	console.log(part2Total)
}
main();