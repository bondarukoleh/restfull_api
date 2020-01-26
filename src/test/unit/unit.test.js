
function add(a, b) {
	return a + b;
}

test('Some simple test', () => {
	expect(add(1, 2)).toBe(3)
});

