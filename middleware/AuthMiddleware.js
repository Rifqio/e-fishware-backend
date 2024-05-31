const AuthService = require('../service/AuthService');
const BaseResponse = require('../utils/response')
const { Logger } = require('../utils/logger');

const AuthVerify = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = AuthService.VerifyAuthToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        Logger.error(`[AuthMiddleware::AuthVerify] | Error: ${error.message}`);
        return BaseResponse(res).unauthorized()
    }
};

module.exports = { AuthVerify };
