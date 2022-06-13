import firebase from "firebase"
const app = firebase.initializeApp({
    apiKey:"KcLAOx6aXiPTk6SAD5d7GMa_Rp7rStTSdHT6ZwoJyFs",
    dataBaseURL: "https://desafio-m6-61197-default-rtdb.firebaseio.com/",
    projectId:"desafio-m6-61197",
    authDomain:"desafio-m6.firebaseapp.com"
})

const rtdb = firebase.database();

export {rtdb}

