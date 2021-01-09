import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { auth } from '../firebase';

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

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const styles = useStyles();

	const handleSubmit = (e) => {
		e.preventDefault();
		auth.sendPasswordResetEmail(email)
			.then(() => {
				setSuccess(true);
			})
			.catch((err) => {
				console.error(err);
				setError('Error sending passwording reset link');
			});
	};

	const renderMsg = () => {
		if (success) return <Typography color='primary'>Link sent!</Typography>;
		else if (error) return <Typography color='error'>{error}</Typography>;
	};

	return (
		<Container className={styles.paper} component='main' maxWidth='xs'>
			<Avatar className={styles.avatar}>
				<LockOutlinedIcon />
			</Avatar>

			<Typography component='h1' variant='h5'>
				Reset Password
			</Typography>

			<form className={styles.form} onSubmit={handleSubmit}>
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
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</Grid>
					{renderMsg()}
				</Grid>

				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={styles.submit}
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
		</Container>
	);
};

export default ResetPassword;
