const { TransactionType } = require('../utils/constants');
const { Logger } = require('../utils/logger');
const TransactionService = require('../service/TransactionService');
const NotificationService = require('../service/NotificationService');
const { isEmpty } = require('lodash');
const moment = require('moment');

const Namespace = 'TransactionController';
const CreateTransaction = async (req, res) => {
    const { fish_type, warehouse_id, quantity, transaction_type } = req.body;
    const { user_id } = req.user;

    try {
        if (transaction_type === TransactionType.ADD) {
            console.log(req.body.supplier_id, 'HERE');
            if (!req.body.supplier_id) return res.badRequest('supplier_id is empty');
        }

        const supplierId = req.body.supplier_id || 0;

        let payload = {
            fish_type,
            warehouse_id,
            quantity,
            user_id,
            supplierId,
        };

        const validateStock = await TransactionService.ValidateFishStock(
            fish_type,
            warehouse_id
        );

        if (!validateStock) {
            return res.successWithData([], 'Fish stock not found');
        }

        const currentQuantity = validateStock.quantity;
        const currentTotalPrice = validateStock.totalPrice;

        const getFishPrice = await TransactionService.GetFishPrice(fish_type);
        const fishPrice = getFishPrice.price;

        Logger.info(
            `[${Namespace}::CreateTransaction] | fishType: ${fish_type}, warehouseId: ${warehouse_id} currentQuantity: ${currentQuantity}, maxStock: ${validateStock.maxStock}, minStock: ${validateStock.minStock}`
        );

        let updatedStock = 0;
        let updatedData;
        let fileUrl;

        const totalPrice = quantity * fishPrice;

        payload = {
            ...payload,
            fish_stock_id: validateStock.fishStockId,
            totalPrice,
            currentTotalPrice,
        };

        const firebaseToken = await TransactionService.GetFirebaseToken(
            user_id
        );

        Logger.debug(
            `[${Namespace}::CreateTransaction] | Firebase token: ${firebaseToken.fcm_token}`
        );

        if (transaction_type === TransactionType.ADD) {
            Logger.info(`[${Namespace}::CreateTransaction] | Add stock`);
            updatedStock = quantity + currentQuantity;

            const currentCapacity = await TransactionService.GetWarehouseCapacity(warehouse_id);

            if (updatedStock > currentCapacity) {
                return res.badRequest('Warehouse capacity full');
            }

            if (updatedStock > validateStock.maxStock) {
                return res.badRequest('Stock exceeds the maximum limit');
            }

            updatedData = await TransactionService.AddFishStock(
                payload,
                currentQuantity
            );

            const fishType = updatedData.fish_type;
            const currentDate = moment().utc().format('MMMM D, YYYY');
            const invoiceData = { quantity, fishType, totalPrice, currentDate, fishPrice };
            fileUrl = await TransactionService.GenerateInvoice(invoiceData);

            if (updatedStock >= validateStock.maxStock) {
                NotificationService.SendNotification(
                    firebaseToken.fcm_token,
                    fishType,
                    'max'
                );
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

            const currentDate = moment().utc().format('MMMM D, YYYY');
            const invoiceData = { quantity, fishType, totalPrice, currentDate, fishPrice };
            fileUrl = await TransactionService.GenerateInvoice(invoiceData);

            if (updatedStock <= validateStock.minStock) {
                NotificationService.SendNotification(
                    firebaseToken.fcm_token,
                    fishType
                );
            }
        }

        const response = {
            ...updatedData,
            file_url: fileUrl
        }

        return res.successWithData(response, 'Transaction success');
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
            const generatePdf = await TransactionService.GenerateToPdf(
                transactionHistory
            );
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
    GetTransactionHistory,
};
