const dbModule = {
	async getUserFromDB(id) {
		return new Error('No connection to DB')
	}
};

const mailModule = {
	async send(emailAddress, message) {
		return new Error('No connection to Mail service')
	}
};

const notifyCustomerAboutOrder = async function (order, message) {
	const user = await dbModule.getUserFromDB(order.userId);
	await mailModule.send(user.email, message);
};

describe('notifyCustomerAboutOrder function', () => {
	/* Mocking an not efficient way */
	/* it('should send an email to the customer', async () => {
		dbModule.getUserFromDB = async (id) => {
			console.log('Fake reading from DB...');
			return {id, email: 'a@gmail.com'};
		};

		mailModule.send = async (emailAddress, message) => {
			console.log('Fake sending email...');
			return true;
		};
		const orderBeforeDiscount = {userId: 1, totalPrice: 100};

		const notified = await notifyCustomerAboutOrder(orderBeforeDiscount);
		expect(notified).toEqual(true);
	})
	*/

	it('should send an email to the customer', async () => {
		/* We can use jest mock functions */
		/* const mockFunction = jest.fn();
		mockFunction.mockReturnValue(1);
		mockFunction(); // -> 1
		mockFunction.mockResolvedValue(1);
		await mockFunction(); // -> 1
		mockFunction.mockRejectedValue(new Error('This is error message'));
		try{await mockFunction()}catch (e) {console.log(e)}; // This is error message */
		const user = {id: 1, email: 'a@gmail.com'};
		const message = `Order has been placed.`;
		const expectedMessage = new RegExp(`Order`);

		dbModule.getUserFromDB = jest.fn().mockResolvedValue(user);
		mailModule.send = jest.fn().mockResolvedValue(true);

		await notifyCustomerAboutOrder({userId: user.id, totalPrice: 100}, message);
		// Matcher for mocked functions.
		// So in this test we are checking that notifyCustomerAboutOrder called the send method
		expect(mailModule.send).toHaveBeenCalled();
		expect(mailModule.send).toHaveBeenCalledWith(user.email, message);
		// mailModule.send.mock.calls returns an array of called arguments
		expect(mailModule.send.mock.calls[0][0]).toEqual(user.email);
		expect(mailModule.send.mock.calls[0][1]).toMatch(expectedMessage);
	})
});
