const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Logger } = require('./utils/logger');
const HttpLogger = require('./middleware/HttpLoggerMiddleware');
const ResponseMiddleware = require('./middleware/ResponseMiddleware');
const DB = require('./utils/database');
const routes = require('./routes');
const { SchedulerGroup } = require('./service/SchedulerService');

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Firebase-Token'],
    origin: '*',
}));

app.use(express.json());
app.use(ResponseMiddleware);
app.use(HttpLogger);
app.use('/api', routes);

app.listen(port, async () => {
    await DB.$connect();
    Logger.info('Server is running on port ' + port);

    await SchedulerGroup();
});

process.on('unhandledRejection', (error) => {
    Logger.error('Unhandled Rejection: ' + error.message);
    process.exit(1);
})