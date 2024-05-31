const route = require('express').Router();

const { LoginSchema, RegisterSchema } = require('./schema/AuthSchema');
const AuthController = require('../controller/AuthController');
const { ValidationHandler } = require('../middleware/RequestValidator');

route.post('/login', LoginSchema, ValidationHandler, AuthController.Login);
route.post('/register', RegisterSchema, ValidationHandler, AuthController.Register);

module.exports = route;
