import React, { Component, createContext } from 'react';
import { auth, addUser } from './firebase';

export const UserContext = createContext({ user: null });

class UserProvider extends Component {
	state = {
		user: null
	};

	componentDidMount = async () => {
		auth.onAuthStateChanged(async (userAuth) => {
			const user = await addUser(userAuth);
			this.setState({ user });
		});
	};

	render() {
		const { user } = this.state;
		return (
			<UserContext.Provider value={user}>
				{this.props.children}
			</UserContext.Provider>
		);
	}
}

export default UserProvider;
