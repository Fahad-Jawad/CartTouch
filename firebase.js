// Import the functions you need from the SDKs you need
const admin = require('firebase-admin');
const credentials=require('./serviceAccountKey.json')

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

admin.initializeApp(
    {
        credential:admin.credential.cert(credentials)
    }
)

const db = admin.firestore();
const User =db.collection('users')
module.exports = User;
