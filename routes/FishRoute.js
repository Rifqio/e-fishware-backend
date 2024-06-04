const route = require('express').Router();

const FishController = require('../controller/FishController');
const { ValidationHandler } = require('../middleware/RequestValidator');

const { GetFishSchema, AddFishStock, AddFishType, EditFishType } = require('./schema/FishSchema');

route.get('/type', FishController.GetFishType);
route.post('/type', AddFishType, ValidationHandler, FishController.AddFishType);
route.patch('/type', EditFishType, ValidationHandler, FishController.EditFishType)
route.get('/stock', GetFishSchema, ValidationHandler, FishController.GetFishStock);
route.post('/stock', AddFishStock, ValidationHandler, FishController.AddFishStock);
route.put('/stock', AddFishStock, ValidationHandler, FishController.EditFishStock);

module.exports = route;