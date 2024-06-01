const DB = require('../utils/database');

const GetFish = async (type, warehouseId) => {
    switch (true) {
        case type && warehouseId:
            return await DB.fishStock.findMany({
                where: {
                    type,
                    warehouse_id: warehouseId,
                },
            });
        case type:
            return await DB.fishStock.findMany({
                where: {
                    type,
                },
            });
        case warehouseId:
            return await DB.fishStock.findMany({
                where: {
                    warehouse_id: warehouseId,
                },
            });
        default:
            return await DB.fishStock.findMany({});
    }
};

module.exports = {
    GetFish,
};
