import * as admin from "firebase-admin"
var serviceAccount = require("./key.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: "https://desafio-m6-61197-default-rtdb.firebaseio.com/",
});
const firestore =  admin.firestore();
const rtdb = admin.database()
export { firestore, rtdb}