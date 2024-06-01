const { Logger } = require('../utils/logger');

const RequestLogger = (req, res, next) => {
    const start = new Date();
    const { method, url } = req;

    let requestStartLog = '';
    if (method === 'POST') {
        requestStartLog = `${method} ${url} | payload : ${JSON.stringify(
            req.body
        )}`;
    }
    
    requestStartLog = `${method} ${url}`;

    Logger.http(requestStartLog);

    res.on('finish', () => {
        const end = new Date();
        const duration = end - start;
        const { statusCode } = res;
        const responseLog = `${method} ${url} - ${statusCode} - ${duration}ms`;

        Logger.http(responseLog);
    });

    next();
};

module.exports = RequestLogger;
