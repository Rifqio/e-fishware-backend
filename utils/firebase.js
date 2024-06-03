const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase_env.json');

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = { firebase };
