const { Generatetransaction_id } = require('../helpers');

class BusinessException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.transactionId = Generatetransaction_id();
    }

    static quantityExceedLimit() {
        // prettier-ignore
        return new BusinessException(400, 'Current quantity exceed maximum limit');
    }

    static warehouseStockFull() {
        return new BusinessException(400, 'Warehouse stock currently full');
    }
}

module.exports = { BusinessException };
