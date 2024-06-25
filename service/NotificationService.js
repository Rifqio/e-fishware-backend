const { firebase } = require('../utils/firebase');
const { Logger } = require('../utils/logger');

const Namespace = 'NotificationService';
const SendNotification = async (token, fishType, limitType = 'min') => {
    try {
        const limitTitle = limitType === 'max' ? 'maksimum' : 'minimum';
        const message = {
            notification: {
                title: 'Peringatan Stock!',
                body: `Stock ${fishType} telah mencapai batas ${limitTitle}!`,
            },
            token: token,
            android: {
                priority: 'high',
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
            },
            webpush: {
                headers: {
                    Urgency: 'high',
                },
            },
        };
        const messaging = await firebase.messaging().send(message);
        Logger.info(
            `[${Namespace}::SendNotification] | Notification sent: ${messaging}`
        );
        return messaging;
    } catch (error) {
        Logger.error(
            `[${Namespace}::SendNotification] | Error sending message: ${error}`
        );
        return error;
    }
};

module.exports = {
    SendNotification,
};
