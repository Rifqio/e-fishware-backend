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

module.exports = {
    GetFishSchema,
}