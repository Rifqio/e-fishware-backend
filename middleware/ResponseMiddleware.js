const moment = require('moment');
const ResponseMiddleware = (req, res, next) => {
    req.transactionId = `EFSH${moment().format('DDMMHHYYss')}`;
    
    res.success = (message = null) => {
        return res.status(200).json({
            status: true,
            message: message || 'Success',
            transactionId: req.transactionId,
        });
    };

    res.successWithData = (data, message = null) => {
        return res.status(200).json({
            status: true,
            message: message || 'Success',
            data: data,
            transactionId: req.transactionId,
        });
    };

    res.created = (message = null) => {
        return res.status(201).json({
            status: true,
            message: message || 'Success',
            transactionId: req.transactionId,
        });
    };

    res.createdWithData = (data, message = null) => {
        return res.status(201).json({
            status: true,
            message: message || 'Success',
            data: data,
            transactionId: req.transactionId,
        });
    };

    res.badRequest = (message = null) => {
        return res.status(400).json({
            status: false,
            message: message || 'Bad Request',
            transactionId: req.transactionId,
        });
    };

    res.unauthorized = (message = null) => {
        return res.status(401).json({
            status: false,
            message: message || 'Unauthorized',
            transactionId: req.transactionId,
        });
    };

    res.forbidden = (message = null) => {
        return res.status(403).json({
            status: false,
            message: message || 'Forbidden',
            transactionId: req.transactionId,
        });
    };

    res.internalServerError = (message = null) => {
        return res.status(500).json({
            status: false,
            message: message || 'Internal Server Error',
            transactionId: req.transactionId,
        });
    };

    next();
};

module.exports = ResponseMiddleware;
