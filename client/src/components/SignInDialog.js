import React, { Fragment, useState } from 'react';
import {
	Button,
	Dialog,
	TextField,
	Typography,
	Link,
	Avatar,
	FormControlLabel,
	Checkbox,
	Grid,
	Box
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import { auth } from '../firebase';

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
		width: '100%', // Fix IE 11 issue
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const SignInDialog = ({ entryType }) => {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState('');

	const classes = useStyles();

	const handleOpenClose = () => {
		setOpen(!open);
	};

	const handleSignIn = (e) => {
		e.preventDefault();

		const persistanceType = remember
			? firebase.auth.Auth.Persistence.LOCAL
			: firebase.auth.Auth.Persistence.SESSION;

		auth.setPersistence(persistanceType)
			.then(() => {
				return auth.signInWithEmailAndPassword(email, password);
			})
			.catch((err) => {
				console.error(err);
				if (err.code === 'auth/wrong-password') {
					setError('Incorrect password.');
				}
				setError('There was an error signing in.');
			});
	};

	const renderEntry = () => {
		if (entryType === 'button') {
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
		<Fragment>
			{renderEntry()}
			<Dialog maxWidth='xs' onClose={handleOpenClose} open={open}>
				<Box className={classes.paper}>
					<Avatar className={classes.avatar}>
						<ImageIcon />
					</Avatar>

					<Typography variant='h5' gutterBottom>
						Sign in
					</Typography>

					<Typography align='center' variant='caption'>
						Psst, if you want to test out the application, you can
						sign in with the email "johndoe@gmail.com" and the
						password "admin123"!
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
							onChange={(e) => {
								setEmail(e.target.value);
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
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>

						<FormControlLabel
							control={
								<Checkbox value='remember' color='primary' />
							}
							label='Remember me'
							onChange={(e) => {
								setRemember(e.target.checked);
							}}
						/>

						<Typography color='error'>{error}</Typography>

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
				</Box>
			</Dialog>
		</Fragment>
	);
};

export default SignInDialog;
