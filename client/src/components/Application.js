import React, { useContext } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import { UserContext } from '../UserProvider';
import Images from './Images';

const Application = () => {
	const user = useContext(UserContext);
	console.log(user);
	return user ? (
		<HashRouter basename='/'>
			<NavBar />
			<Switch>
				<Route exact path='/' render={() => <Home />} />
				<Route path='/home' render={() => <Home />} />
				<Route path='/images' render={() => <Images />} />
				<Route path='/' render={() => <Redirect to='/home' />} />
			</Switch>
		</HashRouter>
	) : (
		<HashRouter basename='/'>
			<Switch>
				<Route exact path='/' render={() => <SignIn />} />
				<Route path='/sign-in' render={() => <SignIn />} />
				<Route path='/sign-up' render={() => <SignUp />} />
				<Route
					path='/reset-password'
					render={() => <ResetPassword />}
				/>
				<Route path='/' render={() => <Redirect to='/sign-in' />} />
			</Switch>
		</HashRouter>
	);
};

export default Application;
