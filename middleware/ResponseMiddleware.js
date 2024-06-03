const { Generatetransaction_id } = require('../utils/helpers');
const ResponseMiddleware = (req, res, next) => {
    req.transaction_id = Generatetransaction_id();
    
    res.success = (message = null) => {
        return res.status(200).json({
            status: true,
            message: message || 'Success',
            transaction_id: req.transaction_id,
        });
    };

    res.successWithData = (data, message = null) => {
        return res.status(200).json({
            status: true,
            message: message || 'Success',
            data: data,
            transaction_id: req.transaction_id,
        });
    };

    res.created = (message = null) => {
        return res.status(201).json({
            status: true,
            message: message || 'Success',
            transaction_id: req.transaction_id,
        });
    };

    res.createdWithData = (data, message = null) => {
        return res.status(201).json({
            status: true,
            message: message || 'Success',
            data: data,
            transaction_id: req.transaction_id,
        });
    };

    res.badRequest = (message = null) => {
        return res.status(400).json({
            status: false,
            message: message || 'Bad Request',
            transaction_id: req.transaction_id,
        });
    };

    res.unauthorized = (message = null) => {
        return res.status(401).json({
            status: false,
            message: message || 'Unauthorized',
            transaction_id: req.transaction_id,
        });
    };

    res.forbidden = (message = null) => {
        return res.status(403).json({
            status: false,
            message: message || 'Forbidden',
            transaction_id: req.transaction_id,
        });
    };

    res.internalServerError = (message = null) => {
        return res.status(500).json({
            status: false,
            message: message || 'Internal Server Error',
            transaction_id: req.transaction_id,
        });
    };

    res.sendPdf = (pdf, filename) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(pdf);
    }

    next();
};

module.exports = ResponseMiddleware;
