const { isEmpty } = require('lodash');
const db = require('../utils/database');
const GetPromotionMock = require('../_mock/GetPromotion.json');

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
            base_price: true,
            discount: true,
        },
    });

    if (isEmpty) return GetPromotionMock;

    const transformedData = data.map((item) => {
        const discountPercentage = item.discount / 100;
        const discountedPrice =
            item.base_price - item.base_price * discountPercentage;

        return {
            fish_type: item.fish.type,
            is_active: item.is_active,
            base_price: item.base_price.toLocaleString(),
            discounted_price: discountedPrice.toLocaleString(),
            discount: item.discount,
            start_date: item.start_date,
            end_date: item.end_date,
        };
    });

    return transformedData;
};

const ValidatePromotion = async (payload) => {
    const { fishId, startDate, endDate } = payload 
    const data = await db.promotion.findFirst({
        where: {
            fish_id: fishId,
            OR: [
                {
                    start_date: {
                        lte: new Date(endDate),
                    },
                    end_date: {
                        gte: new Date(startDate),
                    },
                },
                {
                    start_date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                {
                    end_date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
            ],
        },
    });

    return data;
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
        },
    });

    const price = fishPrice.price;
    const discountedPrice = price - price * (discount / 100);

    return await db.promotion.create({
        data: {
            fish_id: fishId,
            is_active: isActive,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            created_by: userId,
            discount: discount,
            base_price: fishPrice.price,
            discounted_price: discountedPrice,
        },
    });
};

const UpdateCurrentPrice = async (discountedPrice, fishId) => {
    return await db.fish.update({
        where: {
            id_fish: fishId,
        },
        data: {
            price: discountedPrice,
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
    DeletePromotion,
    AddPromotion,
    ValidatePromotion,
    UpdateCurrentPrice,
};
