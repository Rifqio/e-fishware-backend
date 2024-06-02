const route = require('express').Router();

const { ValidationHandler } = require('../middleware/RequestValidator');
const { CreateFishTransaction } = require('./schema/TransactionSchema');
const TransactionController = require('../controller/TransactionController');
const { AuthVerify } = require('../middleware/AuthMiddleware');

route.use(AuthVerify);
route.post('/', CreateFishTransaction, ValidationHandler, TransactionController.CreateTransaction);

module.exports = route;