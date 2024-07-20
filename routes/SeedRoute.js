const route = require('express').Router();
const SeedController = require('../controller/SeedController');

route.post('/fish', SeedController.SeedFish);
route.post('/user', SeedController.SeedUser);
route.post('/warehouse', SeedController.SeedWarehouse);
route.post('/suppliers', SeedController.SeedSuppliers);

module.exports = route;