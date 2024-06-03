const { checkSchema } = require("express-validator");

const GetTotalSales = checkSchema({
    fishType: {
        in: ['query'],
        isString: true,
        errorMessage: 'fishType must be a string',
        optional: true
    },
    startDate: {
        in: ['query'],
        isDate: true,
        errorMessage: 'startDate must be a date',
        optional: true
    },
    endDate: {
        in: ['query'],
        isDate: true,
        custom: {
            options: (value, { req }) => {
                if (value < req.query.startDate) {
                    throw new Error('endDate must be greater than startDate');
                }
                return true;
            },
        }
    }
})

module.exports = {
    GetTotalSales,
}