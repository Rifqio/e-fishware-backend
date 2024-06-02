const route = require('express').Router();
const AuthRoutes = require('./AuthRoute');
const FishRoutes = require('./FishRoute');
const SeedRoutes = require('./SeedRoute');
const TransactionRoutes = require('./TransactionRoute');

route.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Welcome to E-Fishware API' });
});

route.use('/auth', AuthRoutes);
route.use('/fish', FishRoutes);
route.use('/transaction', TransactionRoutes);
route.use('/seed', SeedRoutes);

module.exports = route;
