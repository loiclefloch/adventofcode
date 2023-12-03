const fs = require("fs");
const { product, sum } = require("../utils/math")

function isNumber(char) {
  return char !== "." && !isNaN(parseInt(char));
}

function isSymbol(char) {
  return char !== "." && isNaN(parseInt(char));
}

function buildSymbolsReach(symbols) {
  const reach = [
    {
      x: -1,
      y: -1,
    },
    {
      x: 0,
      y: -1,
    },
    {
      x: 1,
      y: -1,
    },

    {
      x: -1,
      y: 0,
    },
    {
      x: 1,
      y: 0,
    },

    {
      x: -1,
      y: 1,
    },
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 1,
    },
  ];

  return symbols
    .map(({ x, y }) => {
      return reach.map((r) => ({
        x: x + r.x,
        y: y + r.y,
      }));
    })
    .flat();
}

function parseData(data) {
  const table = data.map((line) => line.split(""));

  const symbols = table
    .map((line, y) =>
      line
        .map((char, x) => {
          if (isSymbol(char)) {
            return {
              char,
              x,
              y,
            };
          }
        })
        .filter(Boolean),
    )
    .flat();

  const digits = table
    .map((line, y) =>
      line
        .map((char, x) => {
          if (isNumber(char)) {
            return {
              x,
              y,
              char,
              value: parseInt(char, 10),
            };
          }
        })
        .filter(Boolean),
    )
    .flat();

  // add groupIndex for digits that are part of a number
  let groupIndex = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const prev = digits[i - 1];

    if (prev && (digit.y !== prev.y || digit.x !== prev.x + 1)) {
      groupIndex++;
    }

    digit.groupIndex = groupIndex;
  }

  const nbGroups = groupIndex + 1;

  const symbolsReach = buildSymbolsReach(symbols);

  const digitsOnReach = getDigitsOnReach(digits, symbolsReach);

  function getNumbersOnReach() {
    let groupIndexesOnReach = [];

    for (let groupIndex = 0; groupIndex < nbGroups; groupIndex++) {
      const hasOneDigitOnReach = digitsOnReach.some(
        (digit) => digit.groupIndex === groupIndex,
      );
      if (hasOneDigitOnReach) {
        groupIndexesOnReach.push(groupIndex);
      }
    }

    const numbersOnReach = buildGroupsNumbers(digits, groupIndexesOnReach);

    return numbersOnReach
  }

  const numbersOnReach = getNumbersOnReach();

  //
  //
  //

  const gears = getGears(symbols, digits, nbGroups);

  //
  //
  //

  return {
    table,
    symbols,
    symbolsReach,
    digits,
    numbersOnReach,
    gears,
    resultPart1: sum(numbersOnReach),
    gearRatio: sum(gears.map(gear => gear.gearRatio))  
	};
}

function getGears(symbols, digits, nbGroups) {
  return symbols
    .filter((symbol) => symbol.char === "*")
    .map((gear) => {
      const symbolsReach = buildSymbolsReach([gear]);
      const digitsOnReach = getDigitsOnReach(digits, symbolsReach);

      let groupIndexesOnReach = [];
      for (let groupIndex = 0; groupIndex < nbGroups; groupIndex++) {
        const hasOneDigitOnReach = digitsOnReach.some(
          (digit) => digit.groupIndex === groupIndex,
        );
        if (hasOneDigitOnReach) {
          groupIndexesOnReach.push(groupIndex);
        }
      }
      if (groupIndexesOnReach.length === 2) {
        const numbersOnReach = buildGroupsNumbers(digits, groupIndexesOnReach);

        return {
          gear,
          groupIndexesOnReach,
          numbersOnReach,
          gearRatio: product(numbersOnReach),
        };
      }
    })
    .filter(Boolean);
}

function getDigitsOnReach(digits, symbolsReach) {
  return digits.filter(({ x, y }) => {
    const onSymbolsReach = symbolsReach.find(
      (symbolReach) => symbolReach.x === x && symbolReach.y === y,
    );
    return !!onSymbolsReach;
  });
}

function buildGroupsNumbers(digits, groupIndexes) {
  return groupIndexes.map((groupIndex) => {
    const digitsForGroupIndex = digits.filter(
      (digit) => digit.groupIndex === groupIndex,
    );

    return digitsForGroupIndex.reduce((number, current) => {
      return number * 10 + current.value;
    }, 0);
  });
}

function main() {
  const data = fs.readFileSync("./input", "utf8").split("\n");
  const engineData = parseData(data);
  console.log(JSON.stringify(engineData, null, 2));
}
main();
