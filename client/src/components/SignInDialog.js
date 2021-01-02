import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	TextField,
	Typography,
	Link,
	Avatar,
	FormControlLabel,
	Checkbox,
	Container,
	Grid,
	Paper
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { makeStyles } from '@material-ui/core/styles';

import { auth } from '../firebase';

import firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh'
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const SignInDialog = ({ buttonType }) => {
	const classes = useStyles();

	const [open, setOpen] = useState(false);

	const handleOpenClose = () => {
		setOpen(!open);
	};

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(true);
	const [error, setError] = useState(null);

	const handleSignIn = (event) => {
		event.preventDefault();

		const persistanceType = remember
			? firebase.auth.Auth.Persistence.LOCAL
			: firebase.auth.Auth.Persistence.SESSION;

		auth.setPersistence(persistanceType)
			.then(() => {
				return auth.signInWithEmailAndPassword(email, password);
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const renderButton = () => {
		if (buttonType === 'button') {
			return (
				<Button color='inherit' onClick={handleOpenClose}>
					Sign In
				</Button>
			);
		} else {
			return (
				<Link
					onClick={handleOpenClose}
					href='/#/sign-up'
					variant='body2'
				>
					Already have an account? Sign in
				</Link>
			);
		}
	};

	return (
		<div>
			{renderButton()}
			<Dialog maxWidth='xs' onClose={handleOpenClose} open={open}>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={handleSignIn}
					>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							onChange={(event) => {
								setEmail(event.target.value);
							}}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							onChange={(event) => {
								setPassword(event.target.value);
							}}
						/>
						<FormControlLabel
							control={
								<Checkbox value='remember' color='primary' />
							}
							label='Remember me'
							onChange={(event) => {
								setRemember(event.target.checked);
							}}
						/>
						{error}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='/#/reset-password' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href='/#/sign-up' variant='body2'>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Dialog>
		</div>
	);
};

export default SignInDialog;
