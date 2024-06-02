const { Logger } = require('../utils/logger');

const RequestLogger = (req, res, next) => {
    const start = new Date();
    const { method, url } = req;
    const transactionId = req.transactionId; 

    let requestStartLog = `${method} ${url} | transaction_id: ${transactionId}`;
    if (method === 'POST') {
        requestStartLog += ` | Payload: ${JSON.stringify(req.body)}`;
    }

    Logger.http(requestStartLog);

    res.on('finish', () => {
        const end = new Date();
        const duration = end - start;
        const { statusCode } = res;
        const responseLog = `${method} ${url} - ${statusCode} - ${duration}ms | transaction_id: ${transactionId}`;

        Logger.http(responseLog);
    });

    next();
};

module.exports = RequestLogger;
