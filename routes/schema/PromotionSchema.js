const { checkSchema } = require("express-validator");

const GetPromotion = checkSchema({
    isActive: {
        in: ['query'],
        optional: true,
        isBoolean: {
            errorMessage: 'isActive must be a boolean',
        }
    }
});

const AddPromotion = checkSchema({
    fishId: {
        in: ['body'],
        isString: {
            errorMessage: 'fishId must be a string',
        },
        isLength: {
            errorMessage: 'fishId must be at least 3 characters long',
            options: {
                min: 3,
            },
        },
    },
    discount: {
        in: ['body'],
        isNumeric: {
            errorMessage: 'discount must be a number',
        },
        custom: {
            options: (value) => {
                if (value < 0 || value > 100) {
                    throw new Error('discount must be between 0 and 100');
                }
                return true;
            }
        }
    },
    startDate: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'startDate must be a date in ISO8601 format',
        },
    },
    endDate: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'endDate must be a date in ISO8601 format',
        },
    },
    isActive: {
        in: ['body'],
        isBoolean: {
            errorMessage: 'isActive must be a boolean',
        },
    },
});

const DeletePromotion = checkSchema({
    id: {
        in: ['query'],
        isUUID: {
            errorMessage: 'id is not properly formatted',
        },
        notEmpty: {
            errorMessage: 'id cannot be empty',
        }
    }
})
module.exports = {
    GetPromotion,
    AddPromotion,
    DeletePromotion
}