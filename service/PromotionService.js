const { isEmpty } = require('lodash');
const db = require('../utils/database');

const GetPromotion = async (isActive) => {
    return await db.promotion.findMany({
        where: {
            is_active: isActive || true,
        },
    });
};

const DeletePromotion = async (id) => {
    const validateFishId = await db.promotion.findFirst({
        where: {
            id_promotion: id,
        },
    });

    if (isEmpty(validateFishId)) {
        throw new Error('Promotion not found');
    } 

    return await db.promotion.delete({
        where: {
            id_promotion: id,
        },
    });
};

module.exports = {
    GetPromotion,
    DeletePromotion
};
