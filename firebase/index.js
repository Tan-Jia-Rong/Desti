
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
} from '@env';

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();
//export const db = getFirestore();
export const storage = getStorage(firebaseApp);