const ListController = require('../controller/ListController');
const ListSchema = require('./schema/ListSchema');

const route = require('express').Router();

route.get('/', ListSchema, ListController.GetList);

module.exports = route;