const db = require('../utils/database');

const GetListWarehouse = async () => {
    const data = await db.$queryRaw`
    SELECT SUM(fish_stock.quantity) AS quantity, fish_stock.warehouse_id, warehouse.max_capacity 
    FROM fish_stock JOIN warehouse ON fish_stock.warehouse_id = warehouse.id_warehouse
    GROUP BY fish_stock.warehouse_id`;

    const transformedData = data.map((item) => {
        return {
            warehouse_id: item.warehouse_id,
            total_quantity: item.quantity,
            max_capacity: item.max_capacity,
        };
    });

    return transformedData;
};

const GetRegisteredFish = async () => {
    const query = await db.$queryRaw`
    SELECT DISTINCT fish.id_fish, fish.type 
    FROM fish_stock JOIN fish ON fish_stock.fish_type = fish.type`;

    return query;
}

const GetList = async (type) => {
    if (type === 'fish') {
        return await db.fish.findMany({});
    }

    if (type === 'registered-fish') {
        return await GetRegisteredFish();
    }

    if (type === 'warehouse') {
        return await GetListWarehouse();
    }

    if (type === 'supplier') {
        return await db.suppliers.findMany();
    }
};

module.exports = {
    GetList,
};
