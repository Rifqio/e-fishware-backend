const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Logger } = require('./utils/logger');
const HttpLogger = require('./middleware/HttpLoggerMiddleware');
const DB = require('./utils/database');
const routes = require('./routes');

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: '*',
}));

app.use(express.json());
app.use(HttpLogger);
app.use('/api', routes);

app.listen(port, async () => {
    await DB.$connect();
    Logger.info('Server is running on port ' + port);
});

process.on('unhandledRejection', (error) => {
    Logger.error('Unhandled Rejection: ' + error.message);
    process.exit(1);
})