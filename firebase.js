import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { config } from './firebaseConfig';

firebase.initializeApp(config);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
