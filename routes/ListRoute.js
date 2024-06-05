const ListController = require('../controller/ListController');
const ListSchema = require('./schema/ListSchema');
const { ValidationHandler } = require('../middleware/RequestValidator');

const route = require('express').Router();

route.get('/', ListSchema, ValidationHandler, ListController.GetList);

module.exports = route;