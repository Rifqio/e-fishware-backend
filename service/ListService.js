const db = require('../utils/database');

const GetList = async (type) => {
    if (type === 'fish') {
        return await db.fish.findMany({});
    }

    if (type === 'warehouse') {
        return await db.warehouse.findMany({});
    }
};

module.exports = {
    GetList,
};
