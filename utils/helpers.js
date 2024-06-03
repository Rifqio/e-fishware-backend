const moment = require('moment');
const GenerateTransactionId = () => {
    return `EFSH${moment().format('DDMMHHYYss')}`
}

module.exports = {
    GenerateTransactionId
}