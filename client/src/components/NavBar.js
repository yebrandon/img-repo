import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img/logo.png';
import {
	AppBar,
	Toolbar,
	Tabs,
	Tab,
	Box,
	Typography,
	IconButton,
	Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import { auth } from '../firebase';

function LinkTab(props) {
	return (
		<Tab
			component='a'
			onClick={(event) => {
				event.preventDefault();
			}}
			{...props}
		/>
	);
}

const useStyles = makeStyles((theme) => ({
	logo: {
		marginRight: theme.spacing(2)
	},
	button: { float: 'right' }
}));

const NavBar = () => {
	const classes = useStyles();
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
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
					<Tabs
						variant='fullWidth'
						value={value}
						onChange={handleChange}
					>
						<Tab component='a' label='Home' href='/#/home' />
						<Tab
							component='a'
							label=' Your Images'
							href='/#/images'
						/>
					</Tabs>
					<Button
						onClick={() => {
							auth.signOut();
						}}
						className='button'
						color='inherit'
					>
						Sign Out
					</Button>
				</Toolbar>
			</AppBar>
			<Toolbar />
		</React.Fragment>
	);
};

export default NavBar;
