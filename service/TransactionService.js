const { toInteger } = require('lodash');
const pdf = require('pdf-creator-node');
const fs = require('fs');

const { TransactionType } = require('../utils/constants');
const DB = require('../utils/database');
const { ConstructDateRange } = require('../utils/helpers');
const moment = require('moment');

const ValidateFishStock = async (fishType, warehouseId) => {
    const fishStock = await DB.fishStock.findFirst({
        where: {
            fish_type: fishType,
            warehouse_id: warehouseId,
        },
    });

    if (!fishStock) {
        return [];
    }

    const data = {
        fishStockId: fishStock.id_fish_stock,
        minStock: fishStock.min_stock,
        maxStock: fishStock.max_stock,
        quantity: fishStock.quantity,
        totalPrice: fishStock.total_price,
    };

    return data;
};

const GetWarehouseCapacity = async (warehouseId) => {
    const data = await DB.warehouse.findFirst({
        where: {
            id_warehouse: warehouseId,
        },
        select: {
            max_capacity: true,
        },
    });

    return data.max_capacity;
};

const GetFishPrice = async (fishType) => {
    return await DB.fish.findFirst({
        where: {
            type: fishType,
        },
        select: {
            price: true,
        },
    });
};

const AddFishStock = async (payload, currentQuantity) => {
    const {
        fish_stock_id,
        quantity,
        user_id,
        totalPrice,
        currentTotalPrice,
        supplierId,
    } = payload;
    const updatedPrice = currentTotalPrice + totalPrice;

    const transaction = await DB.$transaction(async (tx) => {
        await tx.fishStockTransaction.create({
            data: {
                supplier_id: supplierId,
                quantity: quantity,
                transaction_type: TransactionType.ADD,
                fish_stock_id: fish_stock_id,
                updated_by: user_id,
                price: totalPrice,
            },
        });

        const newQuantity = currentQuantity + quantity;
        const updatedFishStock = await tx.fishStock.update({
            where: {
                id_fish_stock: fish_stock_id,
            },
            data: {
                quantity: newQuantity,
                total_price: updatedPrice,
            },
        });

        return updatedFishStock;
    });
    return transaction;
};

const DeductFishStock = async (payload, currentQuantity) => {
    const { fish_stock_id, quantity, user_id, totalPrice, currentTotalPrice } =
        payload;
    const updatedPrice = currentTotalPrice - totalPrice;

    const transaction = await DB.$transaction(async (tx) => {
        await tx.fishStockTransaction.create({
            data: {
                supplier_id: 0,
                quantity: quantity,
                transaction_type: TransactionType.DEDUCT,
                fish_stock_id: fish_stock_id,
                updated_by: user_id,
                price: totalPrice,
            },
        });

        const newQuantity = currentQuantity - quantity;
        const updatedFishStock = await tx.fishStock.update({
            where: {
                id_fish_stock: fish_stock_id,
            },
            data: {
                quantity: newQuantity,
                total_price: updatedPrice,
            },
        });

        return updatedFishStock;
    });
    return transaction;
};

const GetTransactionHistory = async (query) => {
    const { fishType, warehouseId, transactionType, month, date, year } = query;

    let options = {
        where: {},
        orderBy: {
            created_at: 'desc',
        },
    };

    if (fishType) {
        options.where.fish_type = {
            contains: fishType,
        };
    }

    if (warehouseId) {
        options.where.warehouse_id = toInteger(warehouseId);
    }

    if (transactionType) {
        options.where.transaction_type = transactionType;
    }

    if (month || date || year) {
        const { startDate, endDate } = ConstructDateRange(year, month, date);
        options.where.created_at = {
            gte: startDate,
            lte: endDate,
        };
    }

    const baseQuery = await DB.fishTransaction.findMany(options);
    const transformedData = baseQuery.map((data) => {
        return {
            ...data,
            created_at: moment(data.created_at).format('YYYY-MM-DD'),
            updated_at: moment(data.updated_at).format('YYYY-MM-DD'),
        };
    });
    return transformedData;
};

const GetFirebaseToken = async (userId) => {
    return await DB.user.findFirst({
        where: {
            id_user: userId,
        },
        select: {
            fcm_token: true,
        },
    });
};

const GenerateInvoice = async (data) => {
    const html = fs.readFileSync('./assets/invoice.html', 'utf-8');
    const formattedDate = moment().format('DDMMYYHHmmSS');
    data = {
        ...data,
        formattedDate,
    };
    const outputPath = `./assets/invoice/invoice-${formattedDate}.pdf`;
    const options = {
        format: 'A6',
        orientation: 'landscape',
        border: '1mm',
    };

    const document = {
        html: html,
        data: {
            data: data,
        },
        path: outputPath,
        type: 'stream',
    };

    const pdfBuffer = await pdf.create(document, options);
    await fs.promises.writeFile(outputPath, pdfBuffer);

    const fileUrl = process.env.APP_HOST + `/invoice/invoice-${formattedDate}.pdf`;
    return fileUrl;
};

const GenerateToPdf = async (data) => {
    const html = fs.readFileSync('./assets/transaction-history.html', 'utf-8');
    const options = {
        format: 'A5',
        orientation: 'portrait',
        border: '1mm',
    };

    const document = {
        html: html,
        data: {
            data: data,
        },
        type: 'buffer',
    };

    return await pdf.create(document, options);
};

module.exports = {
    AddFishStock,
    DeductFishStock,
    ValidateFishStock,
    GetTransactionHistory,
    GenerateToPdf,
    GetFirebaseToken,
    GetWarehouseCapacity,
    GetFishPrice,
    GenerateInvoice,
};
