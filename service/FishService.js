const { toInteger } = require('lodash');
const DB = require('../utils/database');

const GetFish = async (type, warehouseId) => {
    const intWarehouseId = toInteger(warehouseId);

    if (type && warehouseId) {
        return await DB.fishStock.findMany({
            where: {
                fish_type: type,
                warehouse_id: intWarehouseId,
            },
        });
    }
    if (type) {
        return await DB.fishStock.findMany({
            where: {
                fish_type: type,
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
    return await DB.fish.findMany({
        orderBy: {
            type: 'asc',
        },
    });
};

const GetFishById = async (fishId) => {
    return await DB.fish.findFirst({
        where: {
            id_fish: fishId,
        },
    });
}

const AddFishStock = async (data) => {
    const { fish_type, warehouse_id, quantity, min_stock, max_stock } = data;
    const sanitizedFishType = fish_type.replace(/\s+/g, '-');
    const id_fish_stock = `${sanitizedFishType}-${warehouse_id}`;
    
    const fishStock = await DB.fishStock.create({
        data: {
            fish_type: fish_type,
            warehouse_id,
            quantity,
            min_stock,
            max_stock,
            id_fish_stock: id_fish_stock.toLowerCase(),
        },
    });

    return fishStock;
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

const AddFishType = async (type) => {
    const fish = await DB.fish.create({
        data: {
            type,
        },
    });

    return fish;
};

const EditFishType = async (fishId, type) => {
    const fish = await DB.fish.update({
        where: {
            id_fish: fishId,
        },
        data: {
            type,
        },
    });

    return fish;
}

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
    GetFishById
};
