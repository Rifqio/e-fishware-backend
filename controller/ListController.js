const ListService = require("../service/ListService");
const { Logger } = require("../utils/logger");

const Namespace = 'ListController'
const GetList = async (req, res) => {
    const { type } = req.query;
    try {
        const data = await ListService.GetList(type);
        return res.successWithData(data);
    } catch (error) {
        Logger.error(`[${Namespace}::GetList] | Error: ${error.message} | Stack: ${error.stack}`);
        return res.internalServerError();
    }
};

module.exports = {
    GetList
}