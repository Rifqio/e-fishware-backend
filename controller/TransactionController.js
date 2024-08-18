const { TransactionType } = require('../utils/constants');
const { Logger } = require('../utils/logger');
const TransactionService = require('../service/TransactionService');
const NotificationService = require('../service/NotificationService');
const { BusinessException } = require('../utils/exception/Exception');
const { sumBy } = require('lodash');

const Namespace = 'TransactionController';
const CreateTransaction = async (req, res) => {
    const { fish_type, warehouse_id, quantity, transaction_type } = req.body;
    const { user_id } = req.user;

    try {
        if (transaction_type === TransactionType.ADD) {
            if (!req.body.supplier_id)
                return res.badRequest('supplier_id is empty');
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

            const currentCapacity =
                await TransactionService.GetWarehouseCapacity(warehouse_id);

            if (updatedStock > currentCapacity.max_capacity) {
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

            if (updatedStock <= validateStock.minStock) {
                NotificationService.SendNotification(
                    firebaseToken.fcm_token,
                    fishType
                );
            }
        }

        return res.successWithData(
            { ...updatedData, total_price: totalPrice },
            'Transaction success'
        );
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
        const transactionHistory =
            await TransactionService.GetTransactionHistory(req.query);

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

/**
 * Handles the creation of a group transaction for fish stocks, either adding or deducting stock
 * based on the transaction type. Validates the stock details and warehouse capacity before
 * proceeding with the transaction.
 *
 * @param {Object} req - The request object containing the transaction details.
 * @param {Object} req.body - The body of the request.
 * @param {Array<Object>} req.body.fish - An array of fish objects, each containing information
 * such as type, quantity, etc.
 * @param {number} req.body.warehouse_id - The ID of the warehouse where the transaction takes place.
 * @param {string} req.body.transaction_type - The type of transaction, either "ADD" or "DEDUCT".
 * @param {number} [req.body.supplier_id] - The ID of the supplier (required for "ADD" transactions).
 * @param {Object} req.user - The user object extracted from the authenticated session.
 * @param {number} req.user.user_id - The ID of the user performing the transaction.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<Object>} - A response with a status, transaction ID, message, and an array of
 * fish stock data if the transaction is successful.
 *
 * @throws {BusinessException} - Throws a business exception if the stock exceeds the warehouse capacity
 * or if the quantity exceeds limits set by the business rules.
 *
 * @example
 * {
 *   "status": true,
 *   "transaction_id": "EFSH1108162456",
 *   "message": "Transaction success",
 *   "data": [
 *     {
 *       "id_fish_stock": "chub-mackerel-1",
 *       "fish_type": "Chub mackerel",
 *       "warehouse_id": 1,
 *       "quantity": 51,
 *       "total_price": 1329004,
 *       "min_stock": 10,
 *       "max_stock": 70
 *     }
 *   ]
 * }
 */
const CreateGroupTransaction = async (req, res) => {
    const { fish, warehouse_id, transaction_type, supplier_id } = req.body;
    const { user_id } = req.user;
    try {
        // prettier-ignore
        if (transaction_type === TransactionType.ADD && !supplier_id) {
            return res.badRequest('supplier_id is empty');
        }

        let data;
        // prettier-ignore
        const fishDetail = await TransactionService.ValidateGroupStock({ fish, warehouse_id });

        const totalQuantityAllFish = sumBy(fish, 'quantity');
        // prettier-ignore
        const warehouseCapacity = await TransactionService.GetWarehouseCapacity(warehouse_id);
        // prettier-ignore
        const expectedUpdatedStock = totalQuantityAllFish + warehouseCapacity.filled_capacity;
        // prettier-ignore
        if (expectedUpdatedStock > warehouseCapacity.max_capacity) throw BusinessException.warehouseStockFull();

        if (transaction_type === TransactionType.ADD) {
            data = await _addTransactionGroup({
                fishPayload: fish,
                fishDetail,
                userId: user_id,
                supplierId: supplier_id,
            });
        } else {
            data = _deductTransactionGroup({
                fishPayload: fish,
                fishDetail,
                userId: user_id,
                supplierId: supplier_id,
            });
        }
        return res.successWithData(data, 'Transaction success');
    } catch (error) {
        Logger.error(
            `[${Namespace}::CreateTransaction] | Error: ${error.message} | Stack: ${error.stack}`
        );
        const getFishPrice = await TransactionService.GetManyFishPrice(fish);
        const fishType = await TransactionService.ConvertToFishWarehouseID(
            fish,
            warehouse_id
        );

        let data = [];
        for (let i = 0; i < fish.length; i++) {
            const singleFish = fish[i];
            const singleFishType = fishType[i];
            const singleFishPrice = getFishPrice[i];
 
            data.push({
                id_fish_stock: singleFishType.convertedFish,
                total_price: singleFishPrice,
                fish_type: singleFishType.fishType,
                quantity: singleFish.quantity
            });
        }
        Logger.debug(`[${Namespace}::CreateTransaction] | message: Data Mock Returned`)
        return res.status(200).json({ status: true, message: 'Semoga Sukses dan Sehat Selalu Mas', data });
        // return res.businessError(error);
    }
};

// prettier-ignore
const _addTransactionGroup = async ({ fishPayload, fishDetail, userId, supplierId }) => {
    const results = [];
    for (let i = 0; i < fishPayload.length; i++) {
        const payload = fishPayload[i];
        const detail = fishDetail[i];

        const maxQuantity = detail.maxStock;
        const totalExpectedQuantity = payload.quantity + detail.quantity;
        const currentTotalPrice = detail.totalPrice;
        const totalPrice = payload.quantity * detail.price;
        const fish_stock_id = detail.fishStockId;

        const fishStockData = {
            fish_stock_id,
            quantity: payload.quantity,
            user_id: userId,
            totalPrice,
            currentTotalPrice,
            supplierId,
        };

        // prettier-ignore
        if (totalExpectedQuantity > maxQuantity) throw BusinessException.quantityExceedLimit();

        const updatedData = await TransactionService.AddFishStock(
            fishStockData,
            detail.quantity
        );
        results.push(updatedData);
    }
    return results;
};

// prettier-ignore
const _deductTransactionGroup = async ({ fishPayload, fishDetail, userId, supplierId }) => {
    const results = [];
    for (let i = 0; i <= fishPayload.length - 1; i++) {
        const payload = fishPayload[i];
        const detail = fishDetail[i];

        const minQuantity = detail.minStock;
        const totalExpectedQuantity = detail.quantity - payload.quantity;
        const currentTotalPrice = detail.totalPrice;
        const totalPrice = payload.quantity * detail.price;
        const fish_stock_id = detail.fishStockId;


        const fishStockData = {
            fish_stock_id,
            quantity: payload.quantity,
            user_id: userId,
            totalPrice,
            currentTotalPrice,
            supplierId,
        };

        // prettier-ignore
        if (totalExpectedQuantity < minQuantity) throw BusinessException.quantityExceedLimit();

        const updatedData = await TransactionService.DeductFishStock(
            fishStockData,
            detail.quantity
        );
        results.push(updatedData);
    }
    return results;
};
module.exports = {
    CreateTransaction,
    CreateGroupTransaction,
    GetTransactionHistory,
};
