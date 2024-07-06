const { Logger } = require("../utils/logger");
const PromotionService = require('../service/PromotionService');
const { isEmpty } = require("lodash");

const Namespace = 'PromotionController';
const GetPromotion = async (req, res) => {
    const { isActive } = req.query;
    try {
        const isActiveBool = isActive === 'true';
        const data = await PromotionService.GetPromotion(isActiveBool);
        return res.successWithData(data, 'Promotion data retrieved successfully');
    } catch (error) {
        Logger.error(`[${Namespace}::GetPromotion] | error: ${error} | stack ${error.stack}`);
        return res.internalServerError();
    }
};

const AddPromotion = async (req, res) => {
    const { user_id } = req.user;
    const { fishId } = req.body;
    try {
        const isPromotionValid = await PromotionService.ValidatePromotion(req.body);
        if (!isEmpty(isPromotionValid)) {
            Logger.info(`[${Namespace}::AddPromotion] | Promotion already exists for the given date range`);
            return res.badRequest('Promotion already exists for the given date range');
        }
        
        const data = await PromotionService.AddPromotion(req.body, user_id);
        Logger.info(`[${Namespace}::AddPromotion] | data: ${JSON.stringify(data)}`);

        const discountedPrice = data.discounted_price;
        const updateCurrentPrice = await PromotionService.UpdateCurrentPrice(discountedPrice, fishId);
        Logger.info(`[${Namespace}::AddPromotion] | updateCurrentPrice: ${JSON.stringify(updateCurrentPrice)}`);
        
        return res.createdWithData('data', 'Promotion added successfully');
    } catch (error) {
        Logger.error(`[${Namespace}::AddPromotion] | error: ${error} | stack ${error.stack}`);
        if (error.message === 'Fish id not found') {
            return res.badRequest(error.message);
        }
        return res.internalServerError();
    }
};

const DeletePromotion = async (req, res) => {
    const { id } = req.query;
    try {
        await PromotionService.DeletePromotion(id);
        return res.success(`Promotion with id ${id} deleted successfully`);
    } catch (error) {
        Logger.error(`[${Namespace}::DeletePromotion] | error: ${error} | stack ${error.stack}`);
        if (error.message === 'Promotion not found') {
            return res.badRequest('Promotion id not found!');
        }
        return res.internalServerError();
    }
};

module.exports = {
    GetPromotion,
    AddPromotion,
    DeletePromotion,
};
