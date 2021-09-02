const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/user-route');
const senderRoutes = require('./routes/sender-route');
const pickerRoutes = require('./routes/picker-route');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE, HEAD');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', (req, res) => {
	res.json({ message: 'Done' });
});

app.use('/api/users', usersRoutes);
app.use('/api/sender', senderRoutes);
app.use('/api/picker', pickerRoutes);

const server = app.listen(5000);
const io = require('./socket').init(server);
io.on('connection', (socket) => {
	console.log('Client connected');
});
