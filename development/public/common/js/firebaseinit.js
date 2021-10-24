import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// firebase init
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FirebaseConfig = {
    apiKey: 'AIzaSyBeOE11fAnnEQTimqK8VClhlWMzyOu3ob8',
    authDomain: 'sozialnmedien.firebaseapp.com',
    databaseURL: 'https://sozialnmedien-default-rtdb.firebaseio.com',
    projectId: 'sozialnmedien',
    storageBucket: 'sozialnmedien.appspot.com',
    messagingSenderId: '584583202268',
    appId: '1:584583202268:web:60e4997e7a59138bdfbb19',
    measurementId: 'G-MFG92Y4C4F',
};

// if not hosted on Firebase web, use database at localhost
if (!/sozialnmedien\.web\.app|sozialnmedien\.firebaseapp\.com/.test(location.href)) FirebaseConfig.databaseURL = 'http://0.0.0.0:9000/?ns=sozialnmedien';

// Initialize Firebase
export const App = initializeApp(FirebaseConfig);
export const Database = getDatabase(App);
export const Auth = getAuth(App);

export const RTDB_USERS_ROOT = '/aa14fdd9/users';
export const RTDB_SLOGS_ROOT = '/b6d6cc89/slogs';
export const RTDB_CHATS_ROOT = '/ce471190/chats';

console.log('Log: firebaseinit.js loaded');
