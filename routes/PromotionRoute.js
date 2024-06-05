const route = require('express').Router();
const PromotionController = require('../controller/PromotionController');
const { ValidationHandler } = require('../middleware/RequestValidator');
const { GetPromotion, AddPromotion, DeletePromotion } = require('./schema/PromotionSchema');

route.get('/', GetPromotion, ValidationHandler, PromotionController.GetPromotion);
route.post('/', AddPromotion, ValidationHandler, PromotionController.AddPromotion);
route.delete('/', DeletePromotion, ValidationHandler, PromotionController.DeletePromotion);

module.exports = route;