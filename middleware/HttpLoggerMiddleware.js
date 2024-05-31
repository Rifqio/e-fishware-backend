const { Logger } = require("../utils/logger");

const RequestLogger = (req, res, next) => {
    const start = new Date();
    const { method, url } = req;
    const requestStartLog = `${method} ${url} - Request`;

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