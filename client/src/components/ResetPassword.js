import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { auth } from '../firebase';

const Footer = () => {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			<Link color='inherit' href='https://github.com/yebrandon/img-repo'>
				View on Github
			</Link>
		</Typography>
	);
};

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

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const classes = useStyles();

	const handleSubmit = (event) => {
		event.preventDefault();
		auth.sendPasswordResetEmail(email)
			.then(() => {
				setSuccess(true);
				setTimeout(() => {
					setSuccess(false);
				}, 3000);
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Reset Password
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
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
						</Grid>
						{success ? 'Success!' : error}
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
					>
						Send Reset Link
					</Button>
					<Grid container justify='flex-end'>
						<Grid item>
							<Link href='#/sign-in' variant='body2'>
								Back to Sign In
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Footer />
			</Box>
		</Container>
	);
};

export default ResetPassword;
