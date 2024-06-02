const TransactionService = require('../service/TransactionService');
const { TransactionType } = require('../utils/constants');
const { Logger } = require('../utils/logger');
const BaseResponse = require('../utils/response');

const Namespace = 'TransactionController';
const CreateTransaction = async (req, res) => {
    const { fish_stock_id, quantity, transaction_type } = req.body;
    const { user_id } = req.user;
    try {
        const payload = { fish_stock_id, quantity, user_id };
        const validateStock = await TransactionService.ValidateFishStock(
            fish_stock_id
        );
        const currentQuantity = validateStock.quantity;

        Logger.info(
            `[${Namespace}::CreateTransaction] | currentQuantity: ${currentQuantity}, maxStock: ${validateStock.maxStock}, minStock: ${validateStock.minStock}`
        );

        let updatedStock = 0;
        let updatedData;
        if (transaction_type === TransactionType.ADD) {
            Logger.info(`[${Namespace}::CreateTransaction] | Add stock`)
            updatedStock = quantity + currentQuantity;

            if (updatedStock > validateStock.maxStock) {
                return BaseResponse(res).badRequest(
                    'Stock exceeds the maximum limit'
                );
            }

            updatedData = await TransactionService.AddFishStock(payload, currentQuantity);
        }

        if (transaction_type === TransactionType.DEDUCT) {
            Logger.info(`[${Namespace}::CreateTransaction] | Deduct stock`);
            updatedStock = currentQuantity - quantity;

            if (updatedStock < validateStock.minStock) {
                return BaseResponse(res).badRequest(
                    'Stock is below the minimum limit'
                );
            }
            
            updatedData = await TransactionService.DeductFishStock(payload, currentQuantity);
        }

        return BaseResponse(res).successWithData(updatedData, 'Transaction success');
    } catch (error) {
        Logger.error(
            `[${Namespace}::CreateTransaction] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return BaseResponse(res).internalServerError();
    }
};

module.exports = {
    CreateTransaction,
};
