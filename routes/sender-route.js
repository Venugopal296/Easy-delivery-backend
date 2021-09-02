const express = require('express');

const senderController = require('../controllers/sender-controller');

const router = express.Router();

router.post('/createOrder', senderController.createOrder);
router.get('/fetchOrder', senderController.fetchOrder);

module.exports = router;
