const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');

const { Logger } = require('../utils/logger');
const AuthService = require('../service/AuthService');

const Namespace = 'AuthController';

const Register = async (req, res) => {
    const { email, password, repeat_password } = req.body;
    const firebaseToken = req.headers['x-firebase-token'];
    try {
        const findExistingUser = await AuthService.FindExistingUser(email);
        if (!isEmpty(findExistingUser)) {
            return res.forbidden('User already exists');
        }

        const isPasswordMatch = await AuthService.CheckRepeatPassword(
            password,
            repeat_password
        );
        if (!isPasswordMatch) {
            return res.badRequest('Password does not match');
        }

        const user = await AuthService.RegisterUser(req.body, firebaseToken);
        const token = AuthService.GenerateAuthToken({
            name: user.full_name,
            user_id: user.id_user,
            email: user.email,
        });

        return res.createdWithData(
            {
                token,
                profile: {
                    name: user.full_name,
                    email: user.email,
                    employee_id: user.employee_id,
                    user_id: user.user_id,
                },
            },
            'User registered successfully'
        );
    } catch (error) {
        Logger.error(`[${Namespace}::register] | Error: ${error.message}`);
        return res.internalServerError();
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;
    const firebaseToken = req.headers['x-firebase-token'];

    try {
        const user = await AuthService.FindExistingUser(email);

        if (isEmpty(user)) {
            return res.unauthorized('Invalid credentials');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.unauthorized('Invalid credentials');
        }

        const token = AuthService.GenerateAuthToken({
            name: user.full_name,
            user_id: user.id_user,
            email: user.email,
        });

        await AuthService.InsertFirebaseToken(email, firebaseToken);

        return res.successWithData(
            {
                token,
                profile: {
                    name: user.full_name,
                    email: user.email,
                    user_id: user.id_user,
                },
            },
            'User logged in successfully'
        );
    } catch (error) {
        Logger.error(`[${Namespace}::login] | Error: ${error.message}`);
        return res.internalServerError();
    }
};

module.exports = {
    Register,
    Login,
};
