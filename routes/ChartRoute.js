const route = require('express').Router();

const ChartController = require('../controller/ChartController');
const { GetTotalSales } = require('./schema/ChartSchema');

route.get('/', GetTotalSales, ChartController.GetTotalSales);
route.get('/demand', ChartController.GetMostDemandedFish);

module.exports = route;