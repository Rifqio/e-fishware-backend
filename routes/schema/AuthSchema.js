const { checkSchema } = require('express-validator');

const LoginSchema = checkSchema({
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
        isEmail: {
            errorMessage: 'Invalid email',
        },
    },
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
    },
});

const RegisterSchema = checkSchema({
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
        isEmail: {
            errorMessage: 'Invalid email',
        },
    },
    full_name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Full name cannot be empty',
        },
    },
    employee_id: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Employee ID cannot be empty',
        },
    },
    password: {
        in: ['body'],
        isLength: {
            errorMessage: 'Password must be at least 8 characters long',
            options: { min: 8 },
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
    },
    repeat_password: {
        in: ['body'],
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error(
                        'Password confirmation does not match password'
                    );
                }
                return true;
            },
        },
    },
});
module.exports = {
    LoginSchema,
    RegisterSchema,
};
