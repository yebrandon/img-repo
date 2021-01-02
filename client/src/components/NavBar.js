import React, { useState } from 'react';
import {
	AppBar,
	Toolbar,
	Tabs,
	Tab,
	Typography,
	IconButton,
	Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import { auth } from '../firebase';
import SignInDialog from './SignInDialog';
import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	logo: {
		marginRight: theme.spacing(2)
	},
	button: { float: 'right' }
}));

const NavBar = () => {
	const classes = useStyles();
	let location = useLocation();
	const renderSignInOut = () => {
		if (auth.currentUser) {
			return (
				<Button
					className='button'
					color='inherit'
					onClick={() => {
						auth.signOut();
					}}
				>
					Sign Out
				</Button>
			);
		} else {
			return <SignInDialog className='button' buttonType='button' />;
		}
	};

	const renderTabs = () => {
		if (auth.currentUser) {
			return (
				<Tab
					label=' Your Images'
					value='/images'
					component={Link}
					to='/images'
				/>
			);
		}
	};

	return (
		<React.Fragment>
			<AppBar position='fixed'>
				<Toolbar>
					<IconButton
						edge='start'
						className={classes.logo}
						color='inherit'
						aria-label='menu'
					>
						<ImageIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						ImgRepo
					</Typography>
					<Tabs variant='fullWidth' value={location.pathname}>
						<Tab
							label='Home'
							value='/home'
							component={Link}
							to='/home'
						/>
						{renderTabs()}
					</Tabs>
					{renderSignInOut()}
				</Toolbar>
			</AppBar>
			<Toolbar />
		</React.Fragment>
	);
};

export default NavBar;
