const { TransactionType } = require('../utils/constants');
const { Logger } = require('../utils/logger');
const TransactionService = require('../service/TransactionService');
const NotificationService = require('../service/NotificationService');

const Namespace = 'TransactionController';
const CreateTransaction = async (req, res) => {
    const { fish_stock_id, quantity, transaction_type } = req.body;
    const firebase_token = req.header['X-Firebase-Token'];
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
            Logger.info(`[${Namespace}::CreateTransaction] | Add stock`);
            updatedStock = quantity + currentQuantity;

            if (updatedStock > validateStock.maxStock) {
                return res.badRequest('Stock exceeds the maximum limit');
            }

            updatedData = await TransactionService.AddFishStock(
                payload,
                currentQuantity
            );
            const fishType = updatedData.fish_type;
            if (updatedStock >= validateStock.maxStock) {
                NotificationService.SendNotification(firebase_token, fishType, 'max');
            }
        }

        if (transaction_type === TransactionType.DEDUCT) {
            Logger.info(`[${Namespace}::CreateTransaction] | Deduct stock`);
            updatedStock = currentQuantity - quantity;

            if (updatedStock < validateStock.minStock) {
                return res.badRequest('Stock is below the minimum limit');
            }

            updatedData = await TransactionService.DeductFishStock(
                payload,
                currentQuantity
            );

            const fishType = updatedData.fish_type;
            if (updatedStock <= validateStock.minStock) {
                NotificationService.SendNotification(firebase_token, fishType);
            }
        }

        return res.successWithData(updatedData, 'Transaction success');
    } catch (error) {
        Logger.error(
            `[${Namespace}::CreateTransaction] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return res.internalServerError();
    }
};

const GetTransactionHistory = async (req, res) => {
    try {
        const { download } = req.query;
        
        const transactionHistory = await TransactionService.GetTransactionHistory(req.query);
        if (download) {
            const generatePdf = await TransactionService.GenerateToPdf(transactionHistory);
            return res.sendPdf(generatePdf, 'transaction-history.pdf');    
        }
        return res.successWithData(transactionHistory);
    } catch (error) {
        Logger.error(
            `[${Namespace}::GetTransactionHistory] | Error: ${error.message} | Stack: ${error.stack}`
        );
        return res.internalServerError();
    }
};

module.exports = {
    CreateTransaction,
    GetTransactionHistory
};
