const { TransactionType } = require('../utils/constants');
const db = require('../utils/database');
const moment = require('moment');

const GetTotalSales = async ({ startDate, endDate, fishType }) => {
    let options = {
        where: {},
    };

    if (options.fishType) {
        options.where.fish_type = fishType;
    }

    if (options.startDate && options.endDate) {
        options.where.created_at = {
            gte: startDate,
            lte: endDate,
        };
    }

    if (options.startDate) {
        options.where.created_at = {
            gte: startDate,
            lte: moment().toISOString(),
        };
    }

    if (options.endDate) {
        options.where.created_at = {
            lte: endDate,
        };
    }

    const baseQuery = await db.fishStock.findMany({
        select: {
            fish_type: true,
            quantity: true,
            transactions: {
                select: {
                    quantity: true,
                    transaction_type: true,
                    created_at: true,
                },
            },
        },
        ...options
    });

    const fishSales = {};

    baseQuery.forEach((stock) => {
        const { fish_type, quantity, transactions } = stock;
        if (!fishSales[fish_type]) {
            fishSales[fish_type] = {
                stock_in: 0,
                stock_out: 0,
                current_stock: quantity,
            };
        }

        transactions.forEach((transaction) => {
            if (transaction.transaction_type === TransactionType.ADD) {
                fishSales[fish_type].stock_in += transaction.quantity;
            } else if (transaction.transaction_type === TransactionType.DEDUCT) {
                fishSales[fish_type].stock_out += transaction.quantity;
            }
        });
    });

    const totalSales = Object.keys(fishSales).map((fish_type) => ({
        fish_type,
        ...fishSales[fish_type],
    }));

    return {
        date: moment().format('YYYY-MM-DD'),
        total_sales: totalSales,
    };
};

module.exports = {
    GetTotalSales,
};
