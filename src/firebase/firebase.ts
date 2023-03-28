import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCVQXVAhc8XzjvpDIk8SexRzKe-FcTkyvE',
  authDomain: 'chat-app-firebase-9f913.firebaseapp.com',
  projectId: 'chat-app-firebase-9f913',
  storageBucket: 'chat-app-firebase-9f913.appspot.com',
  messagingSenderId: '897686176545',
  appId: '1:897686176545:web:e4a20265e388f8ffb63460',
  databaseURL: 'https://chat-app-firebase-9f913-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
