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
            
            const fishPrice = await db.fish.findFirst({
                where: {
                    type: fishStock.fish_type
                },
                select: {
                    price: true
                }
            });
          
            const totalRevenue = fishPrice.price * sale._sum.quantity;
            return {
                fish_type: fishStock.fish.type,
                warehouse_id: fishStock.warehouse_id,
                transaction_type: sale.transaction_type,
                total_quantity_sold: sale._sum.quantity,
                total_revenue: totalRevenue,
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

const GetMostDemandedFish = async () => {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const fishDemandRaw = await db.fishStockTransaction.groupBy({
        by: ['fish_stock_id'],
        where: {
            transaction_type: TransactionType.DEDUCT,
        },
        _sum: {
            quantity: true,
        },
    });

    const fishDemand = {};

    for (const record of fishDemandRaw) {
        const fishStock = await db.fishStock.findUnique({
            where: { id_fish_stock: record.fish_stock_id },
            include: { fish: true },
        });
        const fishType = fishStock.fish.type;

        if (!fishDemand[fishType]) {
            fishDemand[fishType] = 0;
        }

        fishDemand[fishType] += record._sum.quantity;
    }

    let maxDemand = 0;
    let mostDemandedFish = null;

    for (const [fishType, quantity] of Object.entries(fishDemand)) {
        if (quantity > maxDemand) {
            maxDemand = quantity;
            mostDemandedFish = fishType;
        }
    }

    if (!mostDemandedFish) {
        return {
            mostDemandedFish: null,
            totalQuantitySoldThisMonth: 0,
            currentStock: 0,
        };
    }

    const totalQuantitySoldThisMonth = await db.fishStockTransaction.aggregate({
        where: {
            transaction_type: TransactionType.DEDUCT,
            created_at: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
            FishStock: {
                fish_type: mostDemandedFish,
            },
        },
        _sum: {
            quantity: true,
        },
    });

    const currentStock = await db.fishStock.aggregate({
        where: {
            fish_type: mostDemandedFish,
        },
        _sum: {
            quantity: true,
        },
    });

    return {
        mostDemandedFish,
        totalQuantitySoldThisMonth: totalQuantitySoldThisMonth._sum.quantity || 0,
        currentStock: currentStock._sum.quantity || 0,
    };
};

module.exports = {
    GetTotalSales,
    GetMostDemandedFish
};
