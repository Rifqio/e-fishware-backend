const route = require('express').Router();
const SeedController = require('../controller/SeedController');

route.post('/fish', SeedController.SeedFish);
route.post('/user', SeedController.SeedUser);

module.exports = route;