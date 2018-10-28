import firebase from 'firebase/app';
import "firebase/firestore";

const config = {
    apiKey: "AIzaSyAuiw9PytWy28Q39LdC89NrxKUCAz4lJiE",
    authDomain: "devfolio-task-one-lokiiarora.firebaseapp.com",
    databaseURL: "https://devfolio-task-one-lokiiarora.firebaseio.com",
    projectId: "devfolio-task-one-lokiiarora",
    storageBucket: "devfolio-task-one-lokiiarora.appspot.com",
    messagingSenderId: "192180810174"
};

firebase.initializeApp(config);

export default firebase;