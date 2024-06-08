const { Logger } = require("../utils/logger");
const PromotionService = require('../service/PromotionService');

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
    try {
        const data = await PromotionService.AddPromotion(req.body, user_id);
        return res.createdWithData(data, 'Promotion added successfully');
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
