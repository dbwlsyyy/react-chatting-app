// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDtaYqZZhrB6W5tv34YPAD7hgrylKSwxNA',
    authDomain: 'react-chatting-app-951f1.firebaseapp.com',
    projectId: 'react-chatting-app-951f1',
    storageBucket: 'react-chatting-app-951f1.firebasestorage.app',
    messagingSenderId: '538601368819',
    appId: '1:538601368819:web:e73497d00e43c5d6a81b86',
    databaseURL:
        'https://react-chatting-app-951f1-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export default app;
