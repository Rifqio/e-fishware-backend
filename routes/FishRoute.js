const route = require('express').Router();

const FishController = require('../controller/FishController');
const { AuthVerify } = require('../middleware/AuthMiddleware');
const { ValidationHandler } = require('../middleware/RequestValidator');

const { GetFishSchema, AddFishStock, AddFishType } = require('./schema/FishSchema');

// route.use(AuthVerify);

route.get('/type', FishController.GetFishType);
route.post('/type', AddFishType, ValidationHandler, FishController.AddFishType);
route.get('/stock', GetFishSchema, ValidationHandler, FishController.GetFishStock);
route.post('/stock', AddFishStock, ValidationHandler, FishController.AddFishStock);
route.put('/stock', AddFishStock, ValidationHandler, FishController.EditFishStock);

module.exports = route;