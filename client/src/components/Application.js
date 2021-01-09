import React, { useContext } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { UserContext } from '../UserProvider';
import Home from './Home';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import Images from './Images';

const Application = () => {
	const user = useContext(UserContext); // Determine if user is logged in or not
	return user ? (
		<HashRouter basename='/'>
			<Switch>
				<Route exact path='/' render={() => <Home />} />
				<Route path='/home' render={() => <Home />} />
				<Route path='/images' render={() => <Images />} />
				<Route path='/' render={() => <Redirect to='/home' />} />
				{/* Redirect to home if path is not found */}
			</Switch>
		</HashRouter>
	) : (
		<HashRouter basename='/'>
			<Switch>
				<Route exact path='/' render={() => <Home />} />
				<Route path='/home' render={() => <Home />} />
				<Route path='/sign-up' render={() => <SignUp />} />
				<Route
					path='/reset-password'
					render={() => <ResetPassword />}
				/>
				<Route path='/' render={() => <Redirect to='/home' />} />
			</Switch>
		</HashRouter>
	);
};

export default Application;
