const moment = require('moment');
const Generatetransaction_id = () => {
    return `EFSH${moment().format('DDMMHHYYss')}`
}

const ConstructDateRange = (year, month, date) => {
    let startDate, endDate;

    if (year) {
        startDate = moment().year(year).startOf('year');
        endDate = moment().year(year).endOf('year');

        if (month) {
            startDate = moment(startDate)
                .month(month - 1)
                .startOf('month');
            endDate = moment(endDate)
                .month(month - 1)
                .endOf('month');
        }

        if (date) {
            startDate = moment(startDate).date(date).startOf('day');
            endDate = moment(endDate).date(date).endOf('day');
        }
    } else {
        startDate = moment().startOf('year');
        endDate = moment().endOf('year');

        if (month) {
            startDate = moment(startDate)
                .month(month - 1)
                .startOf('month');
            endDate = moment(endDate)
                .month(month - 1)
                .endOf('month');
        }

        if (date) {
            startDate = moment(startDate).date(date).startOf('day');
            endDate = moment(endDate).date(date).endOf('day');
        }
    }

    return {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
    };
};

module.exports = {
    Generatetransaction_id,
    ConstructDateRange
}