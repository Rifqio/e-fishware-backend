const { TransactionType } = require('../utils/constants');
const DB = require('../utils/database');

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

module.exports = {
    AddFishStock,
    DeductFishStock,
    ValidateFishStock,
};
