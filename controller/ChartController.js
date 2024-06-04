const { Logger } = require('../utils/logger')
const ChartService = require('../service/ChartService');

const Namespace = 'ChartController';
const GetTotalSales = async (req, res) => {
    try {
        const { startDate, endDate, fishType } = req.query;
        const data = await ChartService.GetTotalSales({ startDate, endDate, fishType });
        return res.successWithData(data)
    } catch (error) {
        Logger.error(`[${Namespace}::GetTotalSales] | Error: ${error.message} | Stack: ${error.stack}`);
        return res.internalServerError();
    }
};

const GetMostDemandedFish = async (req, res) => {
    try {
        const data = await ChartService.GetMostDemandedFish();
        return res.successWithData(data);
    } catch (error) {
        Logger.error(`[${Namespace}::GetMostDemandedFish] | Error: ${error.message} | Stack: ${error.stack}`);
        return res.internalServerError();
    }
}

module.exports = {
    GetTotalSales,
    GetMostDemandedFish
};
