const { checkSchema } = require('express-validator');
const { TransactionType } = require('../../utils/constants');

const currentYear = new Date().getFullYear();

const CreateFishTransaction = checkSchema({
    'X-Firebase-Token': {
        in: ['header'],
        isString: {
            errorMessage: 'X-Firebase-Token must be a string',
        },
        notEmpty: {
            errorMessage: 'X-Firebase-Token cannot be empty',
        },
    },
    fish_type: {
        in: ['body'],
        isString: {
            errorMessage: 'fish_type must be a string',
        },
        notEmpty: {
            errorMessage: 'fish_type cannot be empty',
        },
    },
    warehouse_id: {
        in: ['body'],
        isInt: {
            errorMessage: 'warehouse_id must be an integer',
        },
        notEmpty: {
            errorMessage: 'warehouse_id cannot be empty',
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
                    throw new Error(
                        'transaction_type must be either IN or OUT'
                    );
                }
                return true;
            },
        },
    },
});

const TransactionHistory = checkSchema({
    fishType: {
        in: ['query'],
        isString: {
            errorMessage: 'fishType must be a string',
        },
        optional: true,
    },
    warehouseId: {
        in: ['query'],
        isInt: {
            errorMessage: 'warehouseId must be an integer',
        },
        optional: true,
    },
    transactionType: {
        in: ['query'],
        custom: {
            options: (value) => {
                if (!Object.values(TransactionType).includes(value)) {
                    throw new Error('transactionType must be either IN or OUT');
                }
                return true;
            },
        },
        optional: true,
    },
    month: {
        in: ['query'],
        isInt: {
            errorMessage: 'month must be an integer and between 1 and 12',
            options: {
                min: 1,
                max: 12,
            },
        },
        optional: true,
    },
    date: {
        in: ['query'],
        isInt: {
            errorMessage: 'date must be an integer and between 1 and 31',
            options: {
                min: 1,
                max: 31,
            },
        },
        optional: true,
    },
    year: {
        in: ['query'],
        isInt: {
            errorMessage: 'year must be an integer and between 10 years ago and current year',
            options: {
                min: currentYear - 10,
                max: currentYear,
            },
        },
        optional: true,
    },
    download: {
        in: ['query'],
        isBoolean: {
            errorMessage: 'download must be a boolean',
        },
        optional: true,
    },
});

module.exports = {
    CreateFishTransaction,
    TransactionHistory,
};
