function add(a, b) {
	return a + b;
}

function greet(name) {
	return `Hello ${name}!`;
}

function prefixer(arr, prefix) {
	return arr.map(item => `${prefix} ${item}`);
}

describe('add function', () => {
	it('should add positive numbers', () => {
		expect(add(1, 2)).toEqual(3)
	});

	it('should add positive and negative numbers', () => {
		expect(add(1, -2)).toEqual(-1)
	});

	it('should add negative numbers', () => {
		expect(add(-1, -2)).toEqual(-3)
	});

	it('should add float numbers', () => {
		expect(add(1.01, 2.03)).toBeCloseTo(3.04)
	});
});

describe('greet function', () => {
	it('should return greeting message', () => {
		const name = 'John';
		const expectedGreet = new RegExp(`${name}`);
		expect(greet(name)).toMatch(expectedGreet);
		expect(greet(name)).toContain(name);
	});
});

describe('prefixer function', () => {
	it('should prefix given array', () => {
		const namesArray = ['John', 'Bill'];
		const prefix = 'Hi';
		const expectedOutPut = [`${prefix} ${namesArray[0]}`, `${prefix} ${namesArray[1]}`];

		// Too general
		expect(prefixer(namesArray, prefix)).toBeDefined();
		expect(prefixer(namesArray, prefix)).not.toBeNull();

		// Too specific
		expect(prefixer(namesArray, prefix)[0]).toEqual(`Hi John`);
		expect(prefixer(namesArray, prefix).length).toEqual(2);

		// Proper
		expect(prefixer(namesArray, prefix)).toContain(`${prefix} ${namesArray[0]}`);
		expect(prefixer(namesArray, prefix)).toContain(`${prefix} ${namesArray[1]}`);

		// Ideal
		expect(prefixer(namesArray, prefix)).toEqual(expect.arrayContaining(expectedOutPut));
	});
});
