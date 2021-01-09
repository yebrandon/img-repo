import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import config from './firebaseConfig';

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const addUser = async (user, email, displayName) => {
	if (user) {
		const userRef = firestore.doc(`users/${user.uid}`);
		const snapshot = await userRef.get();
		if (!snapshot.exists) {
			try {
				await userRef.set({
					email: email,
					displayName: displayName
				});
			} catch (err) {
				console.error('Error creating user document', err);
			}
		}
		return getUser(user.uid);
	} else {
		console.error('No user provided');
	}
};

export const getUser = async (uid) => {
	if (uid) {
		try {
			const userDocument = await firestore.doc(`users/${uid}`).get();
			return {
				uid,
				...userDocument.data()
			};
		} catch (err) {
			console.error('Error fetching user document', err);
		}
	} else {
		console.error('No UID provided to fetch user');
	}
};
