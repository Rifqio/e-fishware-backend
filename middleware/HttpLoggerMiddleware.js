const { Logger } = require('../utils/logger');

const RequestLogger = (req, res, next) => {
    const start = new Date();
    const { method, url } = req;
    const transaction_id = req.transaction_id; 

    let requestStartLog = `${method} ${url} | transaction_id: ${transaction_id}`;
    if (method === 'POST') {
        requestStartLog += ` | payload: ${JSON.stringify(req.body)}`;
    }

    Logger.http(requestStartLog);

    res.on('finish', () => {
        const end = new Date();
        const duration = end - start;
        const { statusCode } = res;
        const responseLog = `${method} ${url} - ${statusCode} - ${duration}ms | transaction_id: ${transaction_id}`;

        Logger.http(responseLog);
    });

    next();
};

module.exports = RequestLogger;
