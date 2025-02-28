// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET endpoint to retrieve customer details
router.get('/', customerController.getCustomers);

// POST endpoint to create a new customer detail
router.post('/', customerController.createCustomer);

module.exports = router;