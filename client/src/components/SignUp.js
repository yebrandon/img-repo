import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ImageIcon from '@material-ui/icons/Image';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { auth, addUser, firestore } from '../firebase';
import SignInDialog from './SignInDialog';

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
		width: '100%', // Fix IE 11 issue
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const SignUp = () => {
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [error, setError] = useState(null);

	const styles = useStyles();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (passwordOne === passwordTwo) {
			const usersRef = firestore.collection('users');
			usersRef
				.where('displayName', '==', displayName)
				.get()
				.then((querySnapshot) => {
					// Check if username is taken
					if (querySnapshot.docs.length === 0) {
						auth.createUserWithEmailAndPassword(email, passwordOne)
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
							.catch((err) => {
								console.error(err);
								setError('Error creating account.');
							});

						setDisplayName('');
						setEmail('');
						setPasswordOne('');
						setPasswordTwo('');
					} else {
						setError('Username is already taken!');
					}
				})
				.catch(function (err) {
					console.error(err);
					setError('Error getting user document.');
				});
		} else {
			setError('Passwords do not match.');
		}
	};

	return (
		<Container className={styles.paper} component='main' maxWidth='xs'>
			<Avatar className={styles.avatar}>
				<ImageIcon />
			</Avatar>

			<Typography component='h1' variant='h5'>
				Sign up
			</Typography>

			<form className={styles.form} onSubmit={handleSubmit}>
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
							onChange={(e) => {
								setDisplayName(
									e.target.value.replace(/[^A-Z0-9]/gi, '')
								); // Prevent spaces and special chars
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
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							value={passwordOne}
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='passwordOne'
							label='Password'
							type='password'
							id='passwordOne'
							autoComplete='current-password'
							onChange={(e) => {
								setPasswordOne(e.target.value.trim()); // Prevent spaces
							}}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							value={passwordTwo}
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='passwordTwo'
							label='Confirm Password'
							type='password'
							id='passwordTwo'
							autoComplete='current-password'
							onChange={(e) => {
								setPasswordTwo(e.target.value.trim());
							}}
						/>
					</Grid>

					<Typography color='error'>{error}</Typography>
				</Grid>

				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={styles.submit}
				>
					Sign Up
				</Button>
			</form>

			<Grid container justify='flex-end'>
				<Grid item>
					<SignInDialog buttonType='link' />
				</Grid>
			</Grid>
		</Container>
	);
};

export default SignUp;
