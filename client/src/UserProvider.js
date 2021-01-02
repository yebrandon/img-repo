import React, { Component, createContext } from 'react';
import { auth, getUserDocument } from './firebase';

export const UserContext = createContext({ user: null });

class UserProvider extends Component {
	state = {
		user: null
	};

	componentDidMount = async () => {
		auth.onAuthStateChanged(async (userAuth) => {
			if (userAuth) {
				const user = await getUserDocument(userAuth);
				this.setState({ user });
			} else {
				this.setState({ user: null });
			}
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
