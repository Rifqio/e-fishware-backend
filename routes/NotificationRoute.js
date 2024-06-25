const { Logger } = require('../utils/logger');
const NotificationService = require('../service/NotificationService');
const route = require('express').Router();

const Namespace = 'NotificationRoute';
route.post('/test', async (req, res) => {
    try {
        const mockToken = 'mock';

        const data = await NotificationService.SendNotification(
            mockToken,
            'test'
        );
        return res.successWithData(data, 'Notification sent');
    } catch (error) {
        Logger.error(`[${Namespace}::NotificationTest] | Error: ${error}`);
        return res.internalServerError();
    }
});

module.exports = route;
