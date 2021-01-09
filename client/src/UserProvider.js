import React, { createContext, useState, useEffect } from 'react';
import { auth, getUser } from './firebase';

export const UserContext = createContext({ user: null });

const UserProvider = (props) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Listen for user auth and set context accordingly
		auth.onAuthStateChanged(async (userAuth) => {
			if (userAuth) {
				setUser(getUser(userAuth));
			} else {
				setUser(null);
			}
		});
	}, []);

	return (
		<UserContext.Provider value={user}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserProvider;
