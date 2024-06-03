const { validationResult } = require('express-validator');
const { GenerateTransactionId } = require('../utils/helpers');

const ValidationHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const response = {
            status: false,
            message: 'Validation Error',
            errors: errors.array({ onlyFirstError: true }).map((error) => ({
                path: error.path,
                message: error.msg,
            })),
            transactionId: GenerateTransactionId(),
        };

        return res.status(400).json(response);
    }

    next();
};

module.exports = {
    ValidationHandler,
};
