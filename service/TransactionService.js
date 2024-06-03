const { toInteger } = require('lodash');
const { TransactionType } = require('../utils/constants');
const DB = require('../utils/database');
const moment = require('moment');

const ValidateFishStock = async (fishStockId) => {
    const fishStock = await DB.fishStock.findFirst({
        where: {
            id_fish_stock: fishStockId,
        },
    });

    const data = {
        minStock: fishStock.min_stock,
        maxStock: fishStock.max_stock,
        quantity: fishStock.quantity,
    };

    return data;
};

const AddFishStock = async (payload, currentQuantity) => {
    const { fish_stock_id, quantity, user_id } = payload;
    const transcation = await DB.$transaction(async (tx) => {
        await tx.fishStockTransaction.create({
            data: {
                quantity: quantity,
                transaction_type: TransactionType.ADD,
                fish_stock_id: fish_stock_id,
                updated_by: user_id,
            },
        });

        const newQuantity = currentQuantity + quantity;
        const updatedFishStock = await tx.fishStock.update({
            where: {
                id_fish_stock: fish_stock_id,
            },
            data: {
                quantity: newQuantity,
            },
        });

        return updatedFishStock;
    });
    return transcation;
};

const DeductFishStock = async (payload, currentQuantity) => {
    const { fish_stock_id, quantity, user_id } = payload;
    const transcation = await DB.$transaction(async (tx) => {
        await tx.fishStockTransaction.create({
            data: {
                quantity: quantity,
                transaction_type: TransactionType.DEDUCT,
                fish_stock_id: fish_stock_id,
                updated_by: user_id,
            },
        });

        const newQuantity = currentQuantity - quantity;
        const updatedFishStock = await tx.fishStock.update({
            where: {
                id_fish_stock: fish_stock_id,
            },
            data: {
                quantity: newQuantity,
            },
        });

        return updatedFishStock;
    });
    return transcation;
};

const constructDateRange = (year, month, date) => {
    let startDate, endDate;

    if (year) {
        startDate = moment().year(year).startOf('year');
        endDate = moment().year(year).endOf('year');

        if (month) {
            startDate = moment(startDate)
                .month(month - 1)
                .startOf('month');
            endDate = moment(endDate)
                .month(month - 1)
                .endOf('month');
        }

        if (date) {
            startDate = moment(startDate).date(date).startOf('day');
            endDate = moment(endDate).date(date).endOf('day');
        }
    } else {
        startDate = moment().startOf('year');
        endDate = moment().endOf('year');

        if (month) {
            startDate = moment(startDate)
                .month(month - 1)
                .startOf('month');
            endDate = moment(endDate)
                .month(month - 1)
                .endOf('month');
        }

        if (date) {
            startDate = moment(startDate).date(date).startOf('day');
            endDate = moment(endDate).date(date).endOf('day');
        }
    }

    return {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
    };
};

const GetTransactionHistory = async (query) => {
    const { fishType, warehouseId, transactionType, month, date, year } = query;

    let options = {
        where: {},
        orderBy: {
            created_at: 'desc',
        }
    };

    if (fishType) {
        options.where.fish_type = fishType;
    }

    if (warehouseId) {
        options.where.warehouse_id = toInteger(warehouseId);
    }

    if (transactionType) {
        options.where.transaction_type = transactionType;
    }

    if (month || date || year) {
        const { startDate, endDate } = constructDateRange(year, month, date);
        options.where.created_at = {
            gte: startDate,
            lte: endDate,
        };
    }

    const baseQuery = await DB.fishTransaction.findMany(options);
    return baseQuery;
};

module.exports = {
    AddFishStock,
    DeductFishStock,
    ValidateFishStock,
    GetTransactionHistory,
};
