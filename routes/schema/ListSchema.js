const { checkSchema } = require("express-validator");

const ListSchema = checkSchema({
    type: {
        in: ['query'],
        matches: {
            options: ['^(fish|warehouse|supplier|registered-fish)$', 'i'],
            errorMessage: 'type is invalid',
        },
        notEmpty: {
            errorMessage: 'type cannot be empty',
        }
    }
})

module.exports = ListSchema