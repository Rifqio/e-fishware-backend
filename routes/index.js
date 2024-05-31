const route = require('express').Router();
const AuthRoutes = require('./AuthRoutes');

route.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Welcome to E-Fishware API' });
});

route.use('/auth', AuthRoutes);

module.exports = route;
