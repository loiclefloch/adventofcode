

function product(list) {
	if (list.length === 0) return NaN;
	return list.reduce((sum, num) => sum * num);
}

function sum(list) {
	if (list.length === 0) return NaN;
	return list.reduce((sum, num) => sum + num, 0);
}

module.exports = {
	product,
	sum,
}