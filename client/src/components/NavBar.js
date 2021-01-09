import React, { Fragment } from 'react';
import {
	AppBar,
	Toolbar,
	Tabs,
	Tab,
	Typography,
	IconButton,
	Button,
	Box,
	makeStyles
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import SignInDialog from './SignInDialog';

const useNavStyles = makeStyles((theme) => ({
	logo: {
		marginRight: theme.spacing(2)
	},
	actionGroup: { marginLeft: 'auto' },
	userName: {
		marginRight: theme.spacing(2)
	}
}));

const NavBar = () => {
	const navStyles = useNavStyles();
	const location = useLocation();

	const renderImagesTab = () => {
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

	const renderSignInOut = () => {
		if (auth.currentUser) {
			return (
				<Fragment>
					<Typography
						className={navStyles.userName}
						variant='body'
						display='inline'
					>
						{auth.currentUser.displayName}
					</Typography>
					<Button
						color='inherit'
						onClick={() => {
							auth.signOut();
						}}
					>
						Sign Out
					</Button>
				</Fragment>
			);
		} else {
			return <SignInDialog color='inherit' entryType='button' />;
		}
	};

	return (
		<React.Fragment>
			<AppBar position='fixed' color='primary'>
				<Toolbar>
					<IconButton
						edge='start'
						className={navStyles.logo}
						color='inherit'
						aria-label='menu'
					>
						<ImageIcon />
					</IconButton>

					<Typography variant='h6'>ImgRepo</Typography>

					<Tabs
						variant='fullWidth'
						value={
							location.pathname.length > 1
								? location.pathname
								: '/home' // select home tab if there is no route provided
						}
					>
						<Tab
							label='Home'
							value='/home'
							component={Link}
							to='/home'
						/>
						{renderImagesTab()}
					</Tabs>

					<Box className={navStyles.actionGroup}>
						{renderSignInOut()}
						<IconButton
							edge='end'
							color='inherit'
							aria-label='menu'
							href='https://github.com/yebrandon/img-repo'
						>
							<GitHubIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			<Toolbar />
		</React.Fragment>
	);
};

export default NavBar;
