import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import UserProvider from './UserProvider';
import Application from './components/Application';
import './App.css';

const App = () => {
	return (
		<UserProvider>
			<CssBaseline />
			<Application />
		</UserProvider>
	);
};

export default App;
