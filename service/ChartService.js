const { round } = require('lodash');
const db = require('../utils/database');
const moment = require('moment');
const { TransactionType } = require('../utils/constants');

const GetTotalSales = async ({ startDate, endDate, fishType }) => {
    const filterConditions = {
        transaction_type: TransactionType.DEDUCT,
    };

    const localStartDate = moment(startDate).add(7, 'hours');
    const localEndDate = moment(endDate).add(7, 'hours');
    
    if (startDate && endDate) {
        filterConditions.created_at = {
            gte: localStartDate.toDate(),
            lte: localEndDate.toDate()
        };
    }

    if (startDate) {
        filterConditions.created_at = {
            gte: localStartDate.toDate(),
        };
    }

    if (endDate) {
        filterConditions.created_at = {
            lte: localEndDate.toDate()
        };
    }
    
    if (fishType) {
        filterConditions.FishStock = {
            fish_type: fishType,
        };
    }

    const totalSalesPerFishTypeRaw = await db.fishStockTransaction.groupBy({
        by: ['fish_stock_id', 'transaction_type'],
        where: filterConditions,
        _sum: {
            quantity: true,
        },
    });

    const totalSalesPerFishType = await Promise.all(
        totalSalesPerFishTypeRaw.map(async (sale) => {
            const fishStock = await db.fishStock.findUnique({
                where: { id_fish_stock: sale.fish_stock_id },
                include: {
                    fish: true,
                    warehouse: true,
                },
            });

            return {
                fish_type: fishStock.fish.type,
                warehouse_id: fishStock.warehouse_id,
                transaction_type: sale.transaction_type,
                total_quantity_sold: sale._sum.quantity,
            };
        })
    );

    const salesOverTimeRaw = await db.fishStockTransaction.groupBy({
        by: ['created_at'],
        where: filterConditions,
        _sum: {
            quantity: true,
        },
        orderBy: {
            created_at: 'asc',
        },
    });

    const salesOverTimeGrouped = salesOverTimeRaw.reduce((acc, sale) => {
        const date = moment(sale.created_at).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = { date, total_quantity_sold: 0 };
        }
        acc[date].total_quantity_sold += sale._sum.quantity;
        return acc;
    }, {});

    const salesOverTime = Object.values(salesOverTimeGrouped);

    const averageSalesPerDay = await db.fishStockTransaction.aggregate({
        where: filterConditions,
        _avg: {
            quantity: true,
        },
    });

    return {
        totalSalesPerFishType,
        salesOverTime,
        averageSalesPerDay: {
            average_quantity_sold: round(averageSalesPerDay._avg.quantity, 2),
        },
    };
};

module.exports = {
    GetTotalSales,
};
