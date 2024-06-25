// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: 'AIzaSyBmBYrgif1R0vT_TgqFjJimvzISJ1L4vjQ',
        authDomain: 'apascentar-ea1de.firebaseapp.com',
        projectId: 'apascentar-ea1de',
        storageBucket: 'apascentar-ea1de.appspot.com',
        messagingSenderId: '141140091463',
        appId: '1:141140091463:web:2604be7343fca425998762',
        
    }

    // Initialize Firebase
    return initializeApp(firebaseConfig)
}