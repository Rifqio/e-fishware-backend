const FishService = require('../service/FishService');
const { Logger } = require('../utils/logger');
const BaseResponse = require('../utils/response');

const Namespace = 'FishController';
const GetFishStock = async (req, res) => {
    const { type, warehouse_id } = req.query;
    try {
        const fish = await FishService.GetFish(type, warehouse_id);
        return BaseResponse(res).successWithData(fish);
    } catch (error) {
        Logger.error(
            `[${Namespace}::GetFish] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return BaseResponse(res).internalServerError();
    }
};

const GetFishType = async (req, res) => {
    try {
        const fish = await FishService.GetFishType();
        return BaseResponse(res).successWithData(fish);
    } catch (error) {
        Logger.error(
            `[${Namespace}::GetFishType] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return BaseResponse(res).internalServerError();
    }
};

const AddFishStock = async (req, res) => {
    const { fish_type, warehouse_id } = req.body
    try {
        await FishService.ValidateFishTypeWarehouse(fish_type, warehouse_id);

        const validateFishStock = await FishService.ValidateFishStock(fish_type, warehouse_id);
        if (validateFishStock) {
            return BaseResponse(res).badRequest('Fish stock already exists');
        }

        const data = await FishService.AddFishStock(req.body);
        return BaseResponse(res).createdWithData(data, 'Fish stock added successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::AddFishStock] | Error: ${error.message} | Stack: ${error.stack}`
        );
        if (error.message.includes('Fish type') || error.message.includes('not found')) {
            return BaseResponse(res).badRequest(error.message);
        }
        return BaseResponse(res).internalServerError();
    }
};

const EditFishStock = async (req, res) => {
    const { fish_type, warehouse_id } = req.body
    try {
        await FishService.ValidateFishTypeWarehouse(fish_type, warehouse_id);

        const validateFishStock = await FishService.ValidateFishStock(fish_type, warehouse_id);
        if (!validateFishStock) {
            return BaseResponse(res).badRequest('Fish stock not found');
        }

        const data = await FishService.EditFishStock(req.body);
        return BaseResponse(res).successWithData(data, 'Fish stock updated successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::EditFishStock] | Error: ${error.message} | Stack: ${error.stack}`
        );
        if (error.message.includes('Fish type') || error.message.includes('not found')) {
            return BaseResponse(res).badRequest(error.message);
        }
        return BaseResponse(res).internalServerError();
    }
};

const AddFishType = async (req, res) => {
    const { type } = req.body
    try {
        const fish = await FishService.AddFishType(type);
        return BaseResponse(res).createdWithData(fish, 'Fish type added successfully');
    } catch (error) {
        Logger.error(
            `[${Namespace}::AddFishType] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return BaseResponse(res).internalServerError();
    }
};

module.exports = {
    GetFishStock,
    GetFishType,
    AddFishStock,
    EditFishStock,
    AddFishType
};
