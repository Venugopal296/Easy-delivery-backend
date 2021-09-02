const express = require('express');

const pickerController = require('../controllers/picker-controller');

const router = express.Router();

router.post('/updateOrder', pickerController.updateOrder);
router.get('/fetchOrder', pickerController.fetchOrder);

module.exports = router;
