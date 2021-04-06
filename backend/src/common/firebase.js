const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(require(process.env.FIREBASE_CONFIG))
});
module.exports = firebaseAdmin;