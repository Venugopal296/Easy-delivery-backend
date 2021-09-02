const fs = require('fs');
const HttpError = require('../models/http-error');
const io = require('../socket');

function jsonReader(filePath, cb) {
	fs.readFile(filePath, (err, fileData) => {
		if (err) {
			return cb && cb(err);
		}
		try {
			const object = JSON.parse(fileData);
			return cb && cb(null, object);
		} catch (err) {
			return cb && cb(err);
		}
	});
}

const createOrder = (req, res, next) => {
	const { user, id, pickupLocation, dropLocation } = req.body;

	jsonReader('./data.json', (err, orders) => {
		if (err) {
			throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
		}

		let newObj = [];
		if (user in orders) {
			newObj = [
				...orders[user],
				{ id, user, pickupLocation, dropLocation, pickedDate: '', deliveredDate: '', status: 'New', pickerId: '' },
			];
		} else {
			newObj = [
				{ id, user, pickupLocation, dropLocation, pickedDate: '', deliveredDate: '', status: 'New', pickerId: '' },
			];
		}

		const obj = {
			...orders,
			[user]: [...newObj],
		};

		let newObj1 = [];
		for (let key in obj) {
			newObj1 = [...newObj1, ...obj[key]];
		}

		io.getIO().emit('order', { orders: newObj1 });
		const jsonString = JSON.stringify(obj, null, 2);
		fs.writeFile('./data.json', jsonString, (err) => {
			if (err) {
				throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
			} else {
				res.json({ message: 'Created Successfully!', orders: newObj });
			}
		});
	});
};

const fetchOrder = (req, res, next) => {
	const { id } = req.query;

	console.log('A', req);

	jsonReader('./data.json', (err, orders) => {
		if (err) {
			throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
		}

		let newObj = [];
		if (id in orders) {
			newObj = [...orders[id]];
		}
		res.json({ orders: newObj });
	});
};

exports.createOrder = createOrder;
exports.fetchOrder = fetchOrder;
