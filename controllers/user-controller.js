const HttpError = require('../models/http-error');

const DUMMY_USERS = {
	sender: [
		{
			id: 's1',
			name: 'Sender 1',
			email: 's1@test.com',
			password: 'testers',
		},
		{
			id: 's2',
			name: 'Sender 2',
			email: 's2@test.com',
			password: 'testers',
		},
		{
			id: 's3',
			name: 'Sender 3',
			email: 's3@test.com',
			password: 'testers',
		},
		{
			id: 's4',
			name: 'Sender 4',
			email: 's4@test.com',
			password: 'testers',
		},
		{
			id: 's5',
			name: 'Sender 5',
			email: 's5@test.com',
			password: 'testers',
		},
	],
	picker: [
		{
			id: 'p1',
			name: 'Picker 1',
			email: 'p1@test.com',
			password: 'testers',
		},
		{
			id: 'p2',
			name: 'Picker 2',
			email: 'p2@test.com',
			password: 'testers',
		},
		{
			id: 'p3',
			name: 'Picker 3',
			email: 'p3@test.com',
			password: 'testers',
		},
		{
			id: 'p4',
			name: 'Picker 4',
			email: 'p4@test.com',
			password: 'testers',
		},
		{
			id: 'p5',
			name: 'Picker 5',
			email: 'p5@test.com',
			password: 'testers',
		},
	],
};

const login = (req, res, next) => {
	const { email, password, customerType } = req.body;

	const identifiedUser = DUMMY_USERS[customerType].find((u) => u.email === email);
	if (!identifiedUser || identifiedUser.password !== password) {
		res.status(401).json({ message: 'Invalid Credential' });
	} else {
		res.json({ message: 'Logged in!', id: identifiedUser.id });
	}
};

exports.login = login;
