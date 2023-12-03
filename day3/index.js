const fs = require("fs")

function isNumber(char) {
	return char !== "." && !isNaN(parseInt(char))
}

function isSymbol(char) {
	return char !== "." && isNaN(parseInt(char))
}

function buildSymbolsReach(symbols) {
	const reach = [
		{
			x: -1,
			y: -1
		},
		{
			x: 0,
			y: -1
		},
		{
			x: 1,
			y: -1
		},

		{
			x: -1,
			y: 0
		},
		{
			x: 1,
			y: 0
		},

		{
			x: -1,
			y: 1
		},
		{
			x: 0,
			y: 1
		},
		{
			x: 1,
			y: 1
		},
	]

	return symbols.map(({ x, y }) => {
		return reach.map(r => ({
			x: x + r.x,
			y: y + r.y,
		}))
	}).flat()
}

function parseData(data) {
	const table = data.map(line => line.split(""))

	const symbols = table.map((line, y) =>
		line.map((char, x) => {
			if (isSymbol(char)) {
				return {
					x,
					y,
				};
			}
		}).filter(Boolean)
	).flat()

	const digits = table.map((line, y) =>
	line.map((char, x) => {
		if (isNumber(char)) {
			return {
				x,
				y,
				char,
				value: parseInt(char, 10)
			};
		}
	}).filter(Boolean)
	).flat()

	// add groupIndex for digits that are part of a number
	let groupIndex = 0
	for (let i = 0; i < digits.length; i++) {
		const digit = digits[i]
		const prev = digits[i - 1]

		if (prev && (digit.y !== prev.y || digit.x !== prev.x + 1)) {
			groupIndex++;
		}

		digit.groupIndex = groupIndex
	}

	const maxGroupIndex = groupIndex

	const symbolsReach = buildSymbolsReach(symbols)

	const digitsOnReach = digits.filter(({ x, y }) => {
		const onSymbolsReach = symbolsReach.find(symbolReach => symbolReach.x === x && symbolReach.y === y)
		return !!onSymbolsReach
	})


	let groupIndexesNotOnReach = [];
	let groupIndexesOnReach = [];
	for (let groupIndex = 0; groupIndex <= maxGroupIndex; groupIndex++) {
		const hasOneDigitOnReach = digitsOnReach.some(digit => digit.groupIndex === groupIndex)
		if (!hasOneDigitOnReach) {
			groupIndexesNotOnReach.push(groupIndex)
		} else {
			groupIndexesOnReach.push(groupIndex)
		}
	}
	

	const numbersNotOnReach = buildGroupsNumbers(digits, groupIndexesNotOnReach);
	const numbersOnReach = buildGroupsNumbers(digits, groupIndexesOnReach);

	return {
    table,
    symbols,
		symbolsReach,
		digits,
		groupIndexesNotOnReach,
		numbersNotOnReach,
		numbersOnReach,
		total: numbersOnReach.reduce((acc, currentValue) => acc + currentValue, 0)
  };
}

function buildGroupsNumbers(digits, groupIndexes) {
	return groupIndexes.map(groupIndex => {
		const digitsForGroupIndex = digits.filter(digit => digit.groupIndex === groupIndex)

		return digitsForGroupIndex.reduce((number, current) => {
			return number * 10 + current.value
		}, 0)
	})
}

function main() {
  const data = fs.readFileSync("./input", "utf8").split("\n")
	const engineData = parseData(data)
  console.log(JSON.stringify(engineData, null, 2))
}
main();