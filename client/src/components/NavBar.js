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
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
	logo: {
		marginRight: theme.spacing(2)
	},
	button: {
		marginLeft: 'auto',
		marginRight: 30
	}
}));

const NavBar = () => {
	const classes = useStyles();
	let location = useLocation();

	const renderSignInOut = () => {
		if (auth.currentUser) {
			return (
				<Button
					className={classes.button}
					color='inherit'
					onClick={() => {
						auth.signOut();
					}}
				>
					Sign Out
				</Button>
			);
		} else {
			return (
				<SignInDialog className={classes.button} buttonType='button' />
			);
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
					<Typography variant='h6'>ImgRepo</Typography>
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
					<IconButton
						edge='start'
						color='inherit'
						aria-label='menu'
						href='https://github.com/yebrandon/img-repo'
					>
						<GitHubIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Toolbar />
		</React.Fragment>
	);
};

export default NavBar;
