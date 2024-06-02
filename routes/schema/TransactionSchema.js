const { checkSchema } = require('express-validator');
const { TransactionType } = require('../../utils/constants');

const CreateFishTransaction = checkSchema({
    fish_stock_id: {
        in: ['body'],
        isString: {
            errorMessage: 'fish_stock_id must be a string',
        },
        notEmpty: {
            errorMessage: 'fish_stock_id cannot be empty',
        },
    },
    quantity: {
        in: ['body'],
        isInt: {
            errorMessage: 'quantity must be an integer',
        },
        notEmpty: {
            errorMessage: 'quantity cannot be empty',
        },
    },
    transaction_type: {
        in: ['body'],
        custom: {
            options: (value) => {
                if (!Object.values(TransactionType).includes(value)) {
                    throw new Error('transaction_type must be either IN or OUT');
                }
                return true;
            },
        },
    },
});

module.exports = {
    CreateFishTransaction,
};
