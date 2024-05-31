const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DB = require('../utils/database');
const { JWT_SECRET } = process.env;

const FindExistingUser = async (email) => {
    return await DB.user.findUnique({
        where: {
            email,
        },
    });
};

const CheckRepeatPassword = async (password, repeatPassword) => {
    return password === repeatPassword;
}

const RegisterUser = async (data) => {
    const { email, password, full_name } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await DB.user.create({
        data: {
            email: email,
            password: hashedPassword,
            full_name: full_name,
        },
    });
}

const GenerateAuthToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '30d',
        issuer: 'e-fishware-server',
        audience: 'e-fishware-client',
    });
};

const VerifyAuthToken = (token) => {
    const auth = token.split(' ')[1];
    return jwt.verify(auth, JWT_SECRET, {
        issuer: 'e-fishware-server',
        audience: 'e-fishware-client',
    });
};

module.exports = {
    RegisterUser,
    GenerateAuthToken,
    VerifyAuthToken,
    FindExistingUser,
    CheckRepeatPassword
};
