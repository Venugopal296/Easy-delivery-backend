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

const updateOrder = (req, res, next) => {
	const { user, id, status, pickerId } = req.body;

	jsonReader('./data.json', (err, orders) => {
		if (err) {
			throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
		}

		const ordersArr = orders[user];
		let indx = ordersArr.findIndex((el) => el.id === id);
		let oldObj = ordersArr[indx];
		if (oldObj.status === status) {
			res.status(404).json({ message: 'Other Picker accepted this, Please pick other items!' });
		} else {
			oldObj.status = status;
			oldObj.pickerId = pickerId;
			if (status === 'Picked') {
				oldObj.pickedDate = new Date();
			}

			if (status === 'Delivered') {
				oldObj.deliveredDate = new Date();
			}

			ordersArr.splice(indx, 1, oldObj);

			const obj = {
				...orders,
				[user]: [...ordersArr],
			};

			let newObj = [];
			for (let key in obj) {
				newObj = [...newObj, ...obj[key]];
			}

      io.getIO().emit('order', { orders: newObj });
      io.getIO().emit('userOrder', { userID: user, orders: ordersArr });

			const jsonString = JSON.stringify(obj, null, 2);
			fs.writeFile('./data.json', jsonString, (err) => {
				if (err) {
					throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
				} else {
					res.json({ message: 'Created Successfully!', orders: newObj });
				}
			});
		}
	});
};

const fetchOrder = (req, res, next) => {
	jsonReader('./data.json', (err, orders) => {
		if (err) {
			throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
		}

		let newObj = [];
		for (let key in orders) {
			newObj = [...newObj, ...orders[key]];
		}
		res.json({ orders: newObj });
	});
};

exports.updateOrder = updateOrder;
exports.fetchOrder = fetchOrder;
