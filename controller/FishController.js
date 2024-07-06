const { isEmpty, toInteger } = require('lodash');
const FishService = require('../service/FishService');
const { Logger } = require('../utils/logger');

const Namespace = 'FishController';
const GetFishStock = async (req, res) => {
    const { type, warehouse_id } = req.query;
    try {
        const fish = await FishService.GetFish(type, warehouse_id);
        return res.createdWithData(fish, 'Fish data retrieved successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::GetFish] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return res.internalServerError();
    }
};

const GetFishType = async (req, res) => {
    try {
        const fish = await FishService.GetFishType();
        return res.successWithData(fish);
    } catch (error) {
        Logger.error(
            `[${Namespace}::GetFishType] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return res.internalServerError();
    }
};

const AddFishStock = async (req, res) => {
    const { fish_type, warehouse_id } = req.body
    try {
        await FishService.ValidateFishTypeWarehouse(fish_type, warehouse_id);

        const validateFishStock = await FishService.ValidateFishStock(fish_type, warehouse_id);
        if (validateFishStock) {
            return res.badRequest('Fish stock already exists');
        }

        const getBasePrice = await FishService.GetFishPrice(fish_type);
        const fishPrice = getBasePrice.price;

        req.body = {
            ...req.body,
            fishPrice
        };

        const data = await FishService.AddFishStock(req.body);
        return res.createdWithData(data, 'Fish stock added successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::AddFishStock] | Error: ${error.message} | Stack: ${error.stack}`
        );
        if (error.message.includes('Fish type') || error.message.includes('not found')) {
            return res.badRequest(error.message);
        }
        return res.internalServerError();
    }
};

const EditFishStock = async (req, res) => {
    const { fish_type, warehouse_id } = req.body
    try {
        await FishService.ValidateFishTypeWarehouse(fish_type, warehouse_id);

        const validateFishStock = await FishService.ValidateFishStock(fish_type, warehouse_id);
        if (!validateFishStock) {
            return res.badRequest('Fish stock not found');
        }

        const data = await FishService.EditFishStock(req.body);
        return res.successWithData(data, 'Fish stock updated successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::EditFishStock] | Error: ${error.message} | Stack: ${error.stack}`
        );
        if (error.message.includes('Fish type') || error.message.includes('not found')) {
            return res.badRequest(error.message);
        }
        return res.internalServerError();
    }
};

const AddFishType = async (req, res) => {
    const { type, price } = req.body
    try {
        const fish = await FishService.AddFishType(type, toInteger(price));
        return res.createdWithData(fish, 'Fish type added successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::AddFishType] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return res.internalServerError();
    }
};

const EditFishType = async (req, res) => {
    const { fish_id, type, price } = req.body;
    try {
        const validateFishId = await FishService.GetFishById(fish_id);
        if (isEmpty(validateFishId)) {
            return res.badRequest('Fish type not found');
        }
        const fish = await FishService.EditFishType(fish_id, type, toInteger(price));
        return res.successWithData(fish, 'Fish type updated successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::EditFishType] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return res.internalServerError();
    }
}

module.exports = {
    GetFishStock,
    GetFishType,
    EditFishType,
    AddFishStock,
    EditFishStock,
    AddFishType
};
