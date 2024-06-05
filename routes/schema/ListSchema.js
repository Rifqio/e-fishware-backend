const { checkSchema } = require("express-validator");

const ListSchema = checkSchema({
    type: {
        in: ['query'],
        matches: {
            options: ['^(fish|warehouse)$', 'i'],
            errorMessage: 'type must be either fish or warehouse',
        },
        notEmpty: {
            errorMessage: 'type cannot be empty',
        }
    }
})

module.exports = ListSchema