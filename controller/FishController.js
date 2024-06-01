const FishService = require('../service/FishService');
const { Logger } = require("../utils/logger");
const BaseResponse = require("../utils/response");

const Namespace = 'FishController';
const GetFish = async (req, res) => {
    const { type, warehouse_id } = req.query;

    try {
        const fish = await FishService.GetFish(type, warehouse_id);
        return BaseResponse(res).successWithData(fish);
    } catch (error) {
        Logger.error(`[${Namespace}::GetFish] | Error: ${error.message} | Stack: ${error.stack}`);
        return BaseResponse(res).internalServerError();
    }
}

module.exports = {
    GetFish
}