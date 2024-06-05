const db = require('../utils/database');

const GetList = async (type) => {
    if (type === 'fish') {
        return await db.fish.findMany({});
    }

    if (type === 'warehouse') {
        return await db.fishStock.groupBy({
            by: ['warehouse_id'],
            _sum: {
                quantity: true
            },
        });
    }
};

module.exports = {
    GetList,
};
