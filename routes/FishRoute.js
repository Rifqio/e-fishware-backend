const route = require('express').Router();

const FishController = require('../controller/FishController');
const { ValidationHandler } = require('../middleware/RequestValidator');

const { GetFishSchema, AddFishStock, AddFishType, EditFishType, AddFishStockAll } = require('./schema/FishSchema');

route.get('/type', FishController.GetFishType);
route.post('/type', AddFishType, ValidationHandler, FishController.AddFishType);
route.patch('/type', EditFishType, ValidationHandler, FishController.EditFishType)
route.get('/stock', GetFishSchema, ValidationHandler, FishController.GetFishStock);
route.post('/stock', AddFishStock, ValidationHandler, FishController.AddFishStock);
route.post('/stock-all', AddFishStockAll, ValidationHandler, FishController.AddFishStockAll)
route.put('/stock', AddFishStock, ValidationHandler, FishController.EditFishStock);

module.exports = route;