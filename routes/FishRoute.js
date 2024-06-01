const route = require('express').Router();

const FishController = require('../controller/FishController');
const { AuthVerify } = require('../middleware/AuthMiddleware');
const { ValidationHandler } = require('../middleware/RequestValidator');

const { GetFishSchema } = require('./schema/FishSchema');

route.use(AuthVerify);

route.get('/', GetFishSchema, ValidationHandler, FishController.GetFish);

module.exports = route;