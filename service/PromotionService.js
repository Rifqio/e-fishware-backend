const { isEmpty } = require('lodash');
const db = require('../utils/database');

const GetPromotion = async (isActive) => {
    const data = await db.promotion.findMany({
        where: { is_active: isActive },
        select: {
            fish: {
                select: {
                    type: true,
                },
            },
            is_active: true,
            start_date: true,
            end_date: true,
            created_by: true,
            base_price: true,
            discount: true,
        },
    });

    const transformedData = data.map((item) => {
        const discountPercentage = item.discount / 100;
        const discountedPrice = item.base_price - item.base_price * discountPercentage;
        
        return {
            fish_type: item.fish.type,
            is_active: item.is_active,
            base_price: item.base_price,
            discounted_price: discountedPrice,
            discount: item.discount,
            start_date: item.start_date,
            end_date: item.end_date,
            created_by: item.created_by,
        };
    });

    return transformedData;
};

const AddPromotion = async (payload, userId) => {
    const { fishId, isActive, startDate, endDate, discount } = payload;
    const validateFishId = await db.fish.findFirst({
        where: {
            id_fish: fishId,
        },
    });

    if (isEmpty(validateFishId)) {
        throw new Error('Fish id not found');
    }

    const fishPrice = await db.fish.findFirst({
        where: {
            id_fish: fishId,
        },
        select: {
            price: true,
        }
    });

    return await db.promotion.create({
        data: {
            fish_id: fishId,
            is_active: isActive,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            created_by: userId,
            discount: discount,
            base_price: fishPrice.price,
        },
    });
};

const UpdateCurrentPrice = async (fishId, discount) => {
    const fishPrice = await db.fish.findFirst({
        where: {
            id_fish: fishId,
        },
        select: {
            price: true,
        }
    });

    const discountPercentage = discount / 100;
    const discountedPrice = fishPrice.price - fishPrice.price * discountPercentage;

    return await db.fish.update({
        where: {
            id_fish: fishId,
        },
        data: {
            price: discountedPrice,
        },
    });

}

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
    DeletePromotion,
    AddPromotion,
    UpdateCurrentPrice
};
