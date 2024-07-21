const { toInteger } = require('lodash');
const DB = require('../utils/database');

const GetFish = async (type, warehouseId) => {
    const intWarehouseId = toInteger(warehouseId);

    if (type && warehouseId) {
        return await DB.fishStock.findMany({
            where: {
                fish_type: {
                    contains: type,
                },
                warehouse_id: intWarehouseId,
            },
        });
    }
    if (type) {
        return await DB.fishStock.findMany({
            where: {
                fish_type: {
                    contains: type,
                },
            },
        });
    }
    if (warehouseId) {
        return await DB.fishStock.findMany({
            where: {
                warehouse_id: intWarehouseId,
            },
        });
    }
    return await DB.fishStock.findMany({});
};

const GetFishType = async () => {
    const data = await DB.fish.findMany({
        orderBy: {
            type: 'asc',
        },
    });

    const transformedData = data.map((item) => {
        return {
            id_fish: item.id_fish,
            type: item.type,
            price_per_kg: item.price.toLocaleString(),
        };
    });

    return transformedData;
};

const GetFishPrice = async (fishType = null, fishId = null) => {
    let whereCondition = {};

    if (fishType) {
        whereCondition = {
            type: fishType,
        };
    } else {
        whereCondition = {
            id_fish: fishId,
        };
    }

    return await DB.fish.findFirst({
        where: whereCondition,
        select: {
            price: true,
        },
    });
};

const GetFishById = async (fishId) => {
    return await DB.fish.findFirst({
        where: {
            id_fish: fishId,
        },
    });
};

const AddFishStock = async (data) => {
    const {
        fish_type,
        warehouse_id,
        quantity,
        min_stock,
        max_stock,
        fishPrice,
    } = data;
    const sanitizedFishType = fish_type.replace(/\s+/g, '-');
    const id_fish_stock = `${sanitizedFishType}-${warehouse_id}`;
    const totalPrice = fishPrice * quantity;

    const fishStock = await DB.fishStock.create({
        data: {
            fish_type: fish_type,
            warehouse_id,
            quantity,
            total_price: totalPrice,
            min_stock,
            max_stock,
            id_fish_stock: id_fish_stock.toLowerCase(),
        },
    });

    return fishStock;
};

const AddFishStockAll = async (data) => {
    const { fish_type, quantity, min_stock, max_stock, fishPrice } = data;

    const sanitizedFishType = fish_type.replace(/\s+/g, '-');
    const totalPrice = fishPrice * quantity;

    const warehouses = await DB.warehouse.findMany({
        select: {
            id_warehouse: true,
        },
    });

    const fishStockPromises = warehouses.map(async (warehouse) => {
        const id_fish_stock = `${sanitizedFishType}-${warehouse.id_warehouse}`;
        return await DB.fishStock.create({
            data: {
                fish_type: fish_type,
                warehouse_id: warehouse.id_warehouse,
                quantity,
                total_price: totalPrice,
                min_stock,
                max_stock,
                id_fish_stock: id_fish_stock.toLowerCase(),
            },
        });
    });

    const fishStocks = await Promise.all(fishStockPromises);
    return fishStocks;
};

const ValidateFishTypeWarehouse = async (fishType, warehouseId) => {
    const fish = await DB.fish.findFirst({
        where: {
            type: fishType,
        },
    });

    if (!fish) {
        throw new Error(`Fish type ${fishType} not found`);
    }

    const warehouse = await DB.warehouse.findFirst({
        where: {
            id_warehouse: warehouseId,
        },
    });

    if (!warehouse) {
        throw new Error(`Warehouse with id ${warehouseId} not found`);
    }

    return { fish, warehouse };
};

const ValidateFishInWarehouse = async (fishType) => {
    const data = await DB.fishStock.findFirst({
        where: {
            fish_type: fishType,
        },
    });

    return data;
};

const AddFishType = async (type, price) => {
    const fish = await DB.fish.create({
        data: {
            type,
            price,
        },
    });

    return fish;
};

const EditFishType = async (fishId, type, price) => {
    const fish = await DB.fish.update({
        where: {
            id_fish: fishId,
        },
        data: {
            type,
            price,
        },
    });

    return fish;
};

const ValidateFishStock = async (fishType, warehouseId) => {
    const fish = await DB.fishStock.findFirst({
        where: {
            fish_type: fishType,
            warehouse_id: warehouseId,
        },
    });
    return fish;
};

const EditFishStock = async (data) => {
    const { fish_type, warehouse_id, quantity, min_stock, max_stock } = data;
    const fishStock = await DB.fishStock.update({
        where: {
            type: fish_type,
            warehouse_id,
        },
        data: {
            quantity,
            min_stock,
            max_stock,
        },
    });

    return fishStock;
};

module.exports = {
    GetFish,
    GetFishType,
    ValidateFishStock,
    ValidateFishTypeWarehouse,
    AddFishStock,
    EditFishStock,
    AddFishType,
    EditFishType,
    GetFishById,
    GetFishPrice,
    AddFishStockAll,
    ValidateFishInWarehouse,
};
