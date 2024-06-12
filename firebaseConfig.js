// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBXe1GnXkLp1KrPh7zHH8kmLR_6-zkBP3k",
  authDomain: "brilliant-era-407902.firebaseapp.com",
  databaseURL: "https://brilliant-era-407902-default-rtdb.firebaseio.com",
  projectId: "brilliant-era-407902",
  storageBucket: "brilliant-era-407902.appspot.com",
  messagingSenderId: "818550448418",
  appId: "1:818550448418:web:bb9ade8fbac79af401857b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = db;
