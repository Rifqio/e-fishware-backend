const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');

const BaseResponse = require('../utils/response');
const { Logger } = require('../utils/logger');
const AuthService = require('../service/AuthService');

const Namespace = 'AuthController';

const Register = async (req, res) => {
    const { email, password, repeat_password } = req.body;
    try {
        const findExistingUser = await AuthService.FindExistingUser(email);
        if (!isEmpty(findExistingUser)) {
            return BaseResponse(res).forbidden('User already exists');
        }

        const isPasswordMatch = await AuthService.CheckRepeatPassword(password, repeat_password);
        if (!isPasswordMatch) {
            return BaseResponse(res).badRequest('Password does not match');
        }

        const user = await AuthService.RegisterUser(req.body);
        const token = AuthService.GenerateAuthToken({
            name: user.full_name,
            user_id: user.user_id,
            email: user.email,
        });

        return BaseResponse(res).createdWithData(
            {
                token,
                profile: {
                    name: user.full_name,
                    email: user.email,
                    user_id: user.user_id,
                },
            },
            'User registered successfully'
        );
    } catch (error) {
        Logger.error(`[${Namespace}::register] | Error: ${error.message}`);
        return BaseResponse(res).internalServerError();
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await AuthService.FindExistingUser(email);

        if (isEmpty(user)) {
            return BaseResponse(res).unauthorized('Invalid credentials');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return BaseResponse(res).unauthorized('Invalid credentials');
        }

        const token = AuthService.GenerateAuthToken({
            name: user.full_name,
            user_id: user.id,
            email: user.email,
        });

        return BaseResponse(res).successWithData(
            {
                token,
                profile: {
                    name: user.full_name,
                    email: user.email,
                    user_id: user.id,
                },
            },
            'User logged in successfully'
        );
    } catch (error) {
        Logger.error(`[${Namespace}::login] | Error: ${error.message}`);
        return BaseResponse(res).internalServerError();
    }
};

module.exports = {
    Register,
    Login,
};
