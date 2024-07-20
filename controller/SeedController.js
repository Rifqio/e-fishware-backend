const { Logger } = require("../utils/logger");
const SeedService = require('../service/SeedService');

const Namespace = 'SeedController';

const SeedFish = async (req, res) => {
    try {
        const { amount } = req.body;
        await SeedService.SeedFish(amount);
        return res.success();     
    } catch (error) {
        Logger.error(`[${Namespace}::SeedFish] | Error: ${error.message} | Stack: ${error.stack}`);
        return res.internalServerError();
    }
}

const SeedUser = async (req, res) => {
    try {
        const { amount } = req.body;
        await SeedService.SeedUser(amount);
        return res.success();
    } catch (error) {
        Logger.error(`[${Namespace}::SeedUser] | Error: ${error.message} | Stack: ${error.stack}`); 
        return res.internalServerError();
    }
}

const SeedWarehouse = async (req, res) => {
    try {
        await SeedService.SeedWarehouse();
        return res.success();
    } catch (error) {
        Logger.error(`[${Namespace}::SeedWarehouse] | Error: ${error.message} | Stack: ${error.stack}`);
        return res.internalServerError();
    }
}

const SeedSuppliers = async (req, res) => {
    try {
        await SeedService.SeedSuppliers();
        return res.success();
    } catch (error) {
        Logger.error(`[${Namespace}::SeedWarehouse] | Error: ${error.message} | Stack: ${error.stack}`);
        return res.internalServerError();
    }
}

module.exports = {
    SeedFish,
    SeedUser,
    SeedWarehouse,
    SeedSuppliers
}