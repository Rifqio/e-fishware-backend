const { Logger } = require("../utils/logger");
const SeedService = require('../service/SeedService');
const BaseResponse = require("../utils/response");

const Namespace = 'SeedController';

const SeedFish = async (req, res) => {
    try {
        const { amount } = req.body;
        await SeedService.SeedFish(amount);
        return BaseResponse(res).success();     
    } catch (error) {
        Logger.error(`[${Namespace}::SeedFish] | Error: ${error.message} | Stack: ${error.stack}`);
        return BaseResponse(res).internalServerError();
    }
}

const SeedUser = async (req, res) => {
    try {
        const { amount } = req.body;
        await SeedService.SeedUser(amount);
        return BaseResponse(res).success();
    } catch (error) {
        Logger.error(`[${Namespace}::SeedUser] | Error: ${error.message} | Stack: ${error.stack}`); 
        return BaseResponse(res).internalServerError();
    }
}

module.exports = {
    SeedFish,
    SeedUser
}