const AuthService = require('../service/AuthService');
const { Logger } = require('../utils/logger');

const AuthVerify = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.unauthorized();
    }

    try {
        const decoded = AuthService.VerifyAuthToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        Logger.error(`[AuthMiddleware::AuthVerify] | Error: ${error.message}`);
        return res.unauthorized()
    }
};

module.exports = { AuthVerify };
