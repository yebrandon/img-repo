import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ResetPassword from './components/ResetPassword';
import './App.css';

const App = () => {
	const user = null;

	return (
		<React.Fragment>
			<CssBaseline />
			{user ? (
				<Home />
			) : (
				<HashRouter basename='/'>
					<NavBar></NavBar>
					<Switch>
						<Route exact path='/' render={() => <SignIn />} />
						<Route path='/sign-in' render={() => <SignIn />} />
						<Route path='/sign-up' render={() => <SignUp />} />
						<Route
							path='/reset-password'
							render={() => <ResetPassword />}
						/>
					</Switch>
				</HashRouter>
			)}
		</React.Fragment>
	);
};

export default App;
