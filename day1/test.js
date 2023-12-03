const getCalibrationValue = require("./index").getCalibrationValue;
const getTotal = require("./index").getTotal;
const replaceStringDigitsFromStart =
  require("./index").replaceStringDigitsFromStart;
const replaceStringDigitsFromEnd =
  require("./index").replaceStringDigitsFromEnd;

test("replaceStringDigitsFromStart", () => {
  expect(replaceStringDigitsFromStart("one")).toBe("1");
  expect(replaceStringDigitsFromStart("two")).toBe("2");
  expect(replaceStringDigitsFromStart("two-two")).toBe("2-2");

  expect(replaceStringDigitsFromStart("64eight6eight6gxdpmtnbfone")).toBe(
    "648686gxdpmtnbf1",
  );
  expect(
    replaceStringDigitsFromStart(
      "eightfour2fourvzksqhxmlkpkfktmdzpmthreetwonehv",
    ),
  ).toBe("8424vzksqhxmlkpkfktmdzpm32nehv");
});

test("replaceStringDigitsFromEnd", () => {
  expect(
    replaceStringDigitsFromEnd(
      "eightfour2fourvzksqhxmlkpkfktmdzpmthreetwonehv",
    ),
  ).toBe("8424vzksqhxmlkpkfktmdzpm3tw1hv");
});

test("getCalibrationValue", () => {
  expect(getCalibrationValue("1abc2").total).toBe(12);
  expect(getCalibrationValue("pqr3stu8vwx").total).toBe(38);
  expect(getCalibrationValue("a1b2c3d4e5f").total).toBe(15);
  expect(getCalibrationValue("treb7uchet").total).toBe(77);
  expect(getCalibrationValue("four289").total).toBe(49);

  expect(getCalibrationValue("two1nine").total).toBe(29);
  expect(getCalibrationValue("eightwothree").total).toBe(83);
  expect(getCalibrationValue("abcone2threexyz").total).toBe(13);
  expect(getCalibrationValue("xtwone3four").total).toBe(24);
  expect(getCalibrationValue("4nineeightseven2").total).toBe(42);
  expect(getCalibrationValue("zoneight234").total).toBe(14);
  expect(getCalibrationValue("7pqrstsixteen").total).toBe(76);

  expect(
    getCalibrationValue("eightfour2fourvzksqhxmlkpkfktmdzpmthreetwonehv").total,
  ).toBe(81);
});

test("getTotal", () => {
  const data = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];
  expect(getTotal(data)).toBe(142);

  const data2 = [
    "two1nine",
    "eightwothree",
    "abcone2threexyz",
    "xtwone3four",
    "4nineeightseven2",
    "zoneight234",
    "7pqrstsixteen",
  ];
  expect(getTotal(data2)).toBe(281);
});
