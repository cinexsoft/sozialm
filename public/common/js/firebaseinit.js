// firebase init
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBeOE11fAnnEQTimqK8VClhlWMzyOu3ob8",
    authDomain: "sozialnmedien.firebaseapp.com",
    databaseURL: "https://sozialnmedien-default-rtdb.firebaseio.com",
    projectId: "sozialnmedien",
    storageBucket: "sozialnmedien.appspot.com",
    messagingSenderId: "584583202268",
    appId: "1:584583202268:web:60e4997e7a59138bdfbb19",
    measurementId: "G-MFG92Y4C4F"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);

// database root
const dbRoot = "/Ci4j82hg96y36rfi96vfrwog7h85f4jh870bpgw52fekftt95hjo7d2i3jgie64k";
console.log("Log: firebase initialised");
