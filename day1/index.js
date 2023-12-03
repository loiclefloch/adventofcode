const fs = require("fs")

function _getFirstDigit(str) {
  const firstDigitStr = str.replace(/^\D+/g, '').split("")[0]
  return parseInt(firstDigitStr, 10);
}

const mappings = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

function replaceStringDigitsFromStart(str) {
  let res = str

  for (i = 0; i < str.length; i++) {
    Object.keys(mappings).forEach(mapping => {
      const substr = res.substr(i)
      if (substr.startsWith(mapping)) {
	res = res.replace(mapping, mappings[mapping])
      }
    })
  }

  return res
}

function replaceStringDigitsFromEnd(str) {
  let res = str

  for (i = str.length; i > 0; i--) {
    Object.keys(mappings).forEach(mapping => {
      const substr = res.substr(0, i)
      if (substr.endsWith(mapping)) {
	res = res.replace(mapping, mappings[mapping])
      }
    })
  }

  return res
}

function getCalibrationValue(itemParam) {
  const startReplaced = replaceStringDigitsFromStart(itemParam);
  const endReplaced = replaceStringDigitsFromEnd(itemParam)

  const first = _getFirstDigit(startReplaced);
  const second = _getFirstDigit(endReplaced.split("").reverse().join(""))

  return {
    source: itemParam,
    startReplaced,
    endReplaced,
    first,
    second,
    total: (10 * first) + second
  }
}


function getTotal(data) {
  const calibrationValues = data.map(getCalibrationValue)

  console.log(JSON.stringify(calibrationValues, null, 2))
  const total = calibrationValues.reduce((acc, currentValue) => acc + currentValue.total, 0)
  return total
}


function main() {
  const data = fs.readFileSync("./input", "utf8").split("\n")
  console.log(data)

  const total = getTotal(data);
  console.log(total)
}
main();

module.exports = {
  getCalibrationValue,
  getTotal,
  replaceStringDigitsFromStart,
  replaceStringDigitsFromEnd,
}
