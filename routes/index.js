const route = require('express').Router();
const { AuthVerify } = require('../middleware/AuthMiddleware');

const AuthRoutes = require('./AuthRoute');
const FishRoutes = require('./FishRoute');
const SeedRoutes = require('./SeedRoute');
const ChartRoutes = require('./ChartRoute');
const TransactionRoutes = require('./TransactionRoute');
const ListRoutes = require('./ListRoute');
const PromotionRoutes = require('./PromotionRoute');
const NotificationRoute = require('./NotificationRoute');

route.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Welcome to E-Fishware API' });
});

route.use('/auth', AuthRoutes);

route.use('/transaction', TransactionRoutes);
route.use('/notification', NotificationRoute);
route.use('/seed', SeedRoutes);
route.use(AuthVerify);
route.use('/fish', FishRoutes);
route.use('/chart', ChartRoutes);
route.use('/list', ListRoutes);
route.use('/promotion', PromotionRoutes);

module.exports = route;
