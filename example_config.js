import Firebase from 'firebase';

const SC_KEY = 'API_KEY';

const firebaseConfig = {
  apiKey: 'API_KEY',
  authDomain: 'audiobase-chat.firebaseapp.com',
  databaseURL: 'https://audiobase-chat.firebaseio.com',
  projectId: 'audiobase-chat',
  storageBucket: 'audiobase-chat.appspot.com',
  messagingSenderId: '587502341898',
  appId: '1:587502341898:web:c9901f44f9da377a',
};
const app = Firebase.initializeApp(firebaseConfig);
const db = app.database();

module.exports = { SC_KEY, db, firebaseConfig };
