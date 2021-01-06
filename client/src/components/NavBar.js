import React from 'react';
import {
	AppBar,
	Toolbar,
	Tabs,
	Tab,
	Typography,
	IconButton,
	Button,
	Box
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import GitHubIcon from '@material-ui/icons/GitHub';
import { makeStyles } from '@material-ui/core/styles';
import { auth } from '../firebase';
import { Link, useLocation } from 'react-router-dom';
import SignInDialog from './SignInDialog';

const useStyles = makeStyles((theme) => ({
	logo: {
		marginRight: theme.spacing(2)
	},
	actionGroup: { marginLeft: 'auto' }
}));

const NavBar = () => {
	const classes = useStyles();
	const location = useLocation();

	const renderImageTab = () => {
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
				<Button
					color='inherit'
					onClick={() => {
						auth.signOut();
					}}
				>
					Sign Out
				</Button>
			);
		} else {
			return <SignInDialog color='inherit' entryType='button' />;
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
						{renderImageTab()}
					</Tabs>
					<Box className={classes.actionGroup}>
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
