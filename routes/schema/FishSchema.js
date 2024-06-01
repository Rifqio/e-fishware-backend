const { checkSchema } = require('express-validator');

const GetFishSchema = checkSchema({
    type: {
        in: ['query'],
        optional: true,
        isString: {
            errorMessage: 'fish type must be a string',
        },
    },
    warehouse_id: {
        in: ['query'],
        optional: true,
        isInt: {
            errorMessage: 'warehouse_id must be an integer',
        },
    },
});

const AddFishStock = checkSchema({
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
    min_stock: {
        in: ['body'],
        isInt: {
            errorMessage: 'min_stock must be an integer',
        },
        notEmpty: {
            errorMessage: 'min_stock cannot be empty',
        },
    },
    max_stock: {
        in: ['body'],
        isInt: {
            errorMessage: 'max_stock must be an integer',
        },
        notEmpty: {
            errorMessage: 'max_stock cannot be empty',
        },
        custom: {
            options: (value, { req }) => {
                if (value < req.body.min_stock) {
                    throw new Error('max_stock cannot be less than min_stock');
                }
                return true;
            }
        }
    },
    
    quantity: {
        in: ['body'],
        isInt: {
            errorMessage: 'quantity must be an integer',
        },
        notEmpty: {
            errorMessage: 'quantity cannot be empty',
        },
        custom: {
            options: (value, { req }) => {
                if (value < req.body.min_stock || value > req.body.max_stock) {
                    throw new Error('quantity must be between min_stock and max_stock');
                }
                return true;
            }
        }
    },
});

const AddFishType = checkSchema({
    type: {
        in: ['body'],
        isString: {
            errorMessage: 'type must be a string',
        },
        notEmpty: {
            errorMessage: 'type cannot be empty',
        },
    },
});

const AddFishTransaction = checkSchema({
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
        contains: {
            options: [['IN', 'OUT']],
            errorMessage: 'transaction_type must be either IN or OUT',
        },
    },
});

module.exports = {
    GetFishSchema,
    AddFishTransaction,
    AddFishStock,
    AddFishType,
};
