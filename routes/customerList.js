var express = require('express');
var router = express.Router();
const { getCustomers } = require('../controllers/database');

router.get('/', getCustomers);

module.exports = router;