import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import UserProvider from './UserProvider';
import Application from './components/Application';

const App = () => {
	return (
		<UserProvider>
			<CssBaseline />
			<Application />
		</UserProvider>
	);
};

export default App;
