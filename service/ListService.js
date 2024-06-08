const db = require('../utils/database');

const GetList = async (type) => {
    if (type === 'fish') {
        return await db.fish.findMany({});
    }

    if (type === 'warehouse') {
        const data = await db.fishStock.groupBy({
            by: ['warehouse_id'],
            _sum: {
                quantity: true
            },
        });

        const transformedData = data.map((item) => {
            return {
                warehouse_id: item.warehouse_id,
                total_quantity: item._sum.quantity
            }
        });
        
        return transformedData
    }
};

module.exports = {
    GetList,
};
