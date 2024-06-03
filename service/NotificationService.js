const { firebase } = require('../utils/firebase');
const { Logger } = require('../utils/logger');

const Namespace = 'NotificationService';
const SendNotification = (token, fishType, limitType = 'min') => {
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

     firebase.messaging().send(message).then((response) => {
        Logger.info(`[${Namespace}::SendNotification] | Successfully sent message: ${response}`);
     }).catch((error) => {
        Logger.error(`[${Namespace}::SendNotification] | Error sending message: ${error}`);
     });
};

module.exports = {
    SendNotification,
};
