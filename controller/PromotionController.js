const { Logger } = require("../utils/logger");
const PromotionService = require('../service/PromotionService');

const Namespace = 'PromotionController';
const GetPromotion = async (req, res) => {
    const { isActive } = req.query;
    try {
        const data = await PromotionService.GetPromotion(isActive);
        return res.succesWithData(data, 'Promotion data retrieved successfully');
    } catch (error) {
        Logger.error(`[${Namespace}::GetPromotion] | error: ${error} | stack ${error.stack}`);
        return res.internalServerError();
    }
};

const AddPromotion = async (req, res) => {};

const DeletePromotion = async (req, res) => {
    const { id } = req.query;
    try {
        await PromotionService.DeletePromotion(id);
        return res.succes(`Promotion with id ${id} deleted successfully`);
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
