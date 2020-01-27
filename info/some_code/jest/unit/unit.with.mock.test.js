const dbModule = {
	async getUserFromDB(id) {
		return new Error('No connection to DB')
	}
};

const applyDiscount = async function (order) {
	const user = await dbModule.getUserFromDB(order.userId);
	if(user.amountMoney > 10) {
		order.totalPrice *= 0.9;
	}
	return order;
};

describe('applyDiscount function', () => {
	it('should apply discount', async () => {
		// mocking dbModule getUserFromDB
		// Not very good approach, since you have to duplicate logic of the function
		dbModule.getUserFromDB = async (id) => {
			console.log('Fake reading from DB...');
			return {id, amountMoney: 11};
		};
		const orderBeforeDiscount = {userId: 1, totalPrice: 100};

		const orderAfterDiscount = await applyDiscount(orderBeforeDiscount);
		expect(orderAfterDiscount.totalPrice).toBeLessThan(100);
	});
});

