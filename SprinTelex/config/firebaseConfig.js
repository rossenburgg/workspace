// ./config/firebaseConfig.js

import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB34mqPP5lRb299ts-C8juPm6d07A_vJf8",
  authDomain: "sprintelex-b267d.firebaseapp.com",
  projectId: "sprintelex-b267d",
  storageBucket: "gs://sprintelex-b267d.appspot.com",
  messagingSenderId: "311897760283",
  appId: "1:311897760283:ios:4eb7276f2569021c148ebe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export { firebase };