const scheduler = require('node-schedule');
const db = require('../utils/database');
const moment = require('moment');
const { Logger } = require('../utils/logger');

const Namespace = 'SchedulerService';

const GetPromotionDue = async () => {
    try {
        Logger.info(`[${Namespace}::GetPromotionDue] | Start`);
        const currentDate = moment().format('YYYY-MM-DD');
        const data = await db.promotion.findMany({
            select: {
                base_price: true,
                start_date: true,
                end_date: true,
                is_active: true,
                discount: true,
                fish: {
                    select: {
                        id_fish: true,
                        price: true,
                        type: true,
                    },
                },
            },
            where: {
                end_date: {
                    lte: currentDate,
                },
                is_active: true,
            },
        });
        Logger.info(
            `[${Namespace}::GetPromotionDue] | Data: ${JSON.stringify(data)}`
        );
        return data;
    } catch (error) {
        Logger.error(
            `[SchedulerService::GetPromotionDue] | Error: ${error.message} | Stack: ${error.stack}`
        );
        throw error;
    }
};

const RevertOriginalPrice = async (fishId, basePrice) => {
    try {
        Logger.info(`[${Namespace}::RevertOriginalPrice] | Start`);
        const data = await db.fish.update({
            where: {
                id_fish: fishId,
            },
            data: {
                price: basePrice,
            },
        });
        Logger.info(
            `[${Namespace}::RevertOriginalPrice] | Data: ${JSON.stringify(
                data
            )}`
        );
        return data;
    } catch (error) {
        Logger.error(
            `[SchedulerService::RevertOriginalPrice] | Error: ${error.message} | Stack: ${error.stack}`
        );
        throw error;
    }
};

const RevertOriginalPriceJob = async () => {
    scheduler.scheduleJob('0 0 0 * * *', async () => {
        try {
            Logger.info(`[${Namespace}::RevertOriginalPriceJob] | Start`);
            const data = await GetPromotionDue();
            Logger.info(
                `[${Namespace}::RevertOriginalPriceJob] | Data retrieved successfully`
            );
            if (data.length > 0) {
                for (const item of data) {
                    const { base_price } = item;
                    const { id_fish } = item.fish;
                    await RevertOriginalPrice(id_fish, base_price);
                    Logger.info(
                        `[${Namespace}::RevertOriginalPriceJob] | Reverted original price for fish id: ${id_fish}`
                    );
                }
            }
        } catch (error) {
            Logger.error(
                `[${Namespace}::RevertOriginalPriceJob] | Error: ${error.message} | Stack: ${error.stack}`
            );
            throw error;
        }
    });
};

const SchedulerGroup = async () => {
    Logger.info(`[${Namespace}::SchedulerGroup] | Initiating Scheduler Group`);
    await RevertOriginalPriceJob();
};

module.exports = {
    RevertOriginalPriceJob,
    SchedulerGroup,
};
