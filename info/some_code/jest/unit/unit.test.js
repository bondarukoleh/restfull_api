function add(a, b) {
	return a + b;
}

function greet(name) {
	return `Hello ${name}!`;
}

function prefixer(arr, prefix) {
	return arr.map(item => `${prefix} ${item}`);
}

function throwException() {
	throw new Error('Error message');
}

function mergeObj(obj, objectToMerge) {
	return {...obj, ...objectToMerge}
}

function fizzBuzz(input) {
	if(typeof input !== 'number') throw new Error(`Input should be number!`);
	if((input % 3 === 0) && (input % 5) === 0) return 'FizzBuzz';
	if(input % 3 === 0) return 'Fizz';
	if(input % 5 === 0) return 'Buzz';
	return input;
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

describe('mergeObj function', () => {
	it('should return merged object', () => {
		const obj = {a: 1};
		const objToMerge = {b: 2};
		const objWithExternalProps = {b: 2, c: 2, d: 2};

		// To specific
		expect(mergeObj(obj, objToMerge)).toEqual({a: 1, b: 2});

		// Pretty ok
		// test will pass, because matcher is not strict, it checks only passed expected property
		expect(mergeObj(obj, objWithExternalProps)).toMatchObject({a: 1, b: 2});
		expect(mergeObj(obj, objWithExternalProps)).toHaveProperty('a', 1);
	});
});

describe('throw exception function', () => {
	it('should throw exception', () => {
		// You can't just expect(throwException()).toThrow() exception won't be caught.
		expect(() => throwException()).toThrow();
	});
});

describe('fizzBuzz function', () => {
	it('should throw error if input not a number', () => {
		expect(() => fizzBuzz('')).toThrow();
		expect(() => fizzBuzz({})).toThrow();
		expect(() => fizzBuzz(true)).toThrow();
		expect(() => fizzBuzz(undefined)).toThrow();
	});

	it('should return FizzBuzz if input is divisible by 3 and 5', () => {
		expect(fizzBuzz(15)).toEqual('FizzBuzz');
	});

	it('should return Fizz if input only is divisible by 3', () => {
		expect(fizzBuzz(9)).toEqual('Fizz');
	});

	it('should return Buzz if input is only divisible by 5', () => {
		expect(fizzBuzz(10)).toEqual('Buzz');
	});

	it('should return input if input is not divisible by 3 or 5', () => {
		expect(fizzBuzz(2)).toEqual(2);
	});
});
