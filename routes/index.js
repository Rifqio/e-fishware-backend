const route = require('express').Router();
const { AuthVerify } = require('../middleware/AuthMiddleware');

const AuthRoutes = require('./AuthRoute');
const FishRoutes = require('./FishRoute');
const SeedRoutes = require('./SeedRoute');
const ChartRoutes = require('./ChartRoute');
const TransactionRoutes = require('./TransactionRoute');
const ListRoutes = require('./ListRoute');

route.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Welcome to E-Fishware API' });
});

route.use('/auth', AuthRoutes);

route.use(AuthVerify);
route.use('/fish', FishRoutes);
route.use('/transaction', TransactionRoutes);
route.use('/chart', ChartRoutes);
route.use('/seed', SeedRoutes);
route.use('/list', ListRoutes);

module.exports = route;
