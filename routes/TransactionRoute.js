const route = require('express').Router();

const { ValidationHandler } = require('../middleware/RequestValidator');
const { CreateFishTransaction, TransactionHistory } = require('./schema/TransactionSchema');
const TransactionController = require('../controller/TransactionController');
const { AuthVerify } = require('../middleware/AuthMiddleware');

// route.use(AuthVerify);
route.post('/', CreateFishTransaction, ValidationHandler, TransactionController.CreateTransaction);
route.get('/history', TransactionHistory,ValidationHandler, TransactionController.GetTransactionHistory);

module.exports = route;