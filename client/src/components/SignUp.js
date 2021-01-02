import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SignInDialog from './SignInDialog';

import { auth, addUser, firestore } from '../firebase';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
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
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const SignUp = () => {
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const classes = useStyles();

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log('sign up button');

		const usersRef = firestore.collection('users');

		usersRef
			.where('displayName', '==', displayName)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.docs.length === 0) {
					auth.createUserWithEmailAndPassword(email, password)
						.then((userCredential) => {
							return userCredential.user
								.updateProfile({ displayName: displayName })
								.then(
									addUser(
										userCredential.user,
										email,
										displayName
									)
								);
						})
						.catch((error) => {
							setError(error.message);
						});
					setDisplayName('');
					setEmail('');
					setPassword('');
				} else {
					setError('Username is already taken!');
				}
			})
			.catch(function (error) {
				console.log('Error getting documents: ', error);
			});
	};

	return (
		<Container component='main' maxWidth='xs'>
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<TextField
								value={displayName}
								variant='outlined'
								margin='normal'
								required
								fullWidth
								id='displayName'
								label='Username'
								name='displayName'
								autoComplete='displayName'
								autoFocus
								onChange={(event) => {
									setDisplayName(event.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								value={email}
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
						</Grid>
						<Grid item xs={12}>
							<TextField
								value={password}
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
						</Grid>
						{error}
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
					>
						Sign Up
					</Button>
				</form>
				<Grid container justify='flex-end'>
					<Grid item>
						<SignInDialog buttonType='link' />
					</Grid>
				</Grid>
			</div>
		</Container>
	);
};

export default SignUp;
