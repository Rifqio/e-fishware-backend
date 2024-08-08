const { BusinessException } = require('../utils/exception/Exception');
const { Generatetransaction_id } = require('../utils/helpers');
const ResponseMiddleware = (req, res, next) => {
    req.transaction_id = Generatetransaction_id();
    
    // if (err instanceof BusinessException) {
    //     return res.status(err.statusCode).json({
    //         status: false,
    //         transaction_id: err.transactionId,
    //         message: err.message,
    //     });
    // }

    res.success = (message = null) => {
        return res.status(200).json({
            status: true,
            transaction_id: req.transaction_id,
            message: message || 'Success',
        });
    };

    res.successWithData = (data, message = null) => {
        return res.status(200).json({
            status: true,
            transaction_id: req.transaction_id,
            message: message || 'Success',
            data: data,
        });
    };

    res.created = (message = null) => {
        return res.status(201).json({
            status: true,
            transaction_id: req.transaction_id,
            message: message || 'Success',
        });
    };

    res.createdWithData = (data, message = null) => {
        return res.status(201).json({
            status: true,
            transaction_id: req.transaction_id,
            message: message || 'Success',
            data: data,
        });
    };

    res.badRequest = (message = null) => {
        return res.status(400).json({
            status: false,
            transaction_id: req.transaction_id,
            message: message || 'Bad Request',
        });
    };

    res.unauthorized = (message = null) => {
        return res.status(401).json({
            status: false,
            transaction_id: req.transaction_id,
            message: message || 'Unauthorized',
        });
    };

    res.forbidden = (message = null) => {
        return res.status(403).json({
            status: false,
            transaction_id: req.transaction_id,
            message: message || 'Forbidden',
        });
    };

    res.internalServerError = (message = null) => {
        return res.status(500).json({
            status: false,
            transaction_id: req.transaction_id,
            message: message || 'Internal Server Error',
        });
    };

    res.businessError = (err = null) => {
        if (err instanceof BusinessException) {
            return res.status(err.statusCode).json({
                status: false,
                transaction_id: err.transactionId,
                message: err.message,
            });
        }
        return res.internalServerError();
    }

    res.sendPdf = (pdf, filename) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(pdf);
    }

    next();
};

module.exports = ResponseMiddleware;
