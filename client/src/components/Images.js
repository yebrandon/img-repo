import React, { useState, useEffect } from 'react';
import {
	Button,
	Paper,
	Tabs,
	Tab,
	LinearProgress,
	Box,
	Typography,
	makeStyles
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { auth, storage } from '../firebase';
import NavBar from './NavBar';
import ImageGrid from './ImageGrid';

const useActionStyles = makeStyles((theme) => ({
	toolBar: {
		flexDirection: 'row',
		display: 'flex',
		alignItems: 'center'
	},
	uploadGroup: {
		alignItems: 'center',
		marginLeft: 'auto'
	},
	selectionText: { marginRight: theme.spacing(2) }
}));

const Images = () => {
	const [images, setImages] = useState([]);
	const [view, setView] = useState('public');
	const [uploads, setUploads] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const actionStyles = useActionStyles();
	const storageRef = storage.ref(
		view === 'private'
			? `images/private/${auth.currentUser.displayName}`
			: 'images/public'
	);

	const loadImage = (fileRef) => {
		// Returns true if image was uploaded by current user
		const filterCurrUser = (metadata) => {
			if (
				(view === 'public' &&
					metadata.customMetadata.uploadedBy ===
						auth.currentUser.displayName) ||
				view !== 'public'
			) {
				return true;
			}
			return false;
		};

		fileRef.getDownloadURL().then((url) => {
			fileRef.getMetadata().then((metadata) => {
				if (filterCurrUser(metadata)) {
					setImages((prevState) => [
						{
							url,
							uploadedBy: metadata.customMetadata.uploadedBy,
							name: fileRef.name,
							date: metadata.timeCreated
						},
						...prevState
					]);
				}
			});
		});
	};

	useEffect(() => {
		const loadAllImages = () => {
			storageRef.list({ maxResults: 100 }).then((files) => {
				files.items.forEach((fileRef) => {
					loadImage(fileRef);
				});
			});
		};

		setImages([]);
		setError('');
		loadAllImages();
	}, [view]);

	const switchView = (e, newValue) => {
		setView(newValue);
	};

	const handleSelect = (e) => {
		setError('');
		setUploads(Array.from(e.target.files));
	};

	const handleUpload = () => {
		setLoading(true);

		const allUploads = uploads.map((upload) => {
			return new Promise((resolve) => {
				const fullUploadName = `${upload.name}|${auth.currentUser.displayName}`;

				const imageNames = images.map((image) => {
					return image.name;
				});

				if (!imageNames.includes(fullUploadName)) {
					// Check if image with same name was already uploaded bu user
					const metadata = {
						customMetadata: {
							uploadedBy: auth.currentUser.displayName
						}
					};
					const fileRef = storageRef.child(fullUploadName);
					const uploadTask = fileRef.put(upload, metadata);
					uploadTask.on(
						'state_changed',
						() => {},
						() => {
							setError('Error uploading files');
						},
						() => {
							loadImage(fileRef);
							resolve('success');
						}
					);
				} else {
					setError(`${upload.name} already exists!`);
					setLoading(false);
				}
			});
		});

		// Reset UI once all uploads are finished
		Promise.all(allUploads).then(() => {
			setUploads([]);
			setLoading(false);
		});
	};

	const handleDelete = (name) => {
		setError('');
		storageRef
			.child(name)
			.delete()
			.then(() => {
				setImages(images.filter((image) => image.name !== name));
			})
			.catch((err) => {
				console.error(err);
				setError('Error deleting image');
			});
	};

	const renderSelection = () => {
		let selectionText;

		if (uploads.length === 1) {
			selectionText = uploads[0].name;
		} else if (uploads.length > 0) {
			selectionText = `Selected ${uploads.length} files`;
		}

		return (
			<Typography className={actionStyles.selectionText} display='inline'>
				{selectionText}
			</Typography>
		);
	};

	return (
		<div>
			<NavBar />

			<Paper square className={actionStyles.toolBar}>
				<Tabs
					value={view}
					indicatorColor='secondary'
					textColor='secondary'
					onChange={switchView}
					variant='fullWidth'
				>
					<Tab value='public' label='Public' />
					<Tab value='private' label='Private' />
				</Tabs>

				<Typography color='error'>{error}</Typography>

				<Box className={actionStyles.uploadGroup}>
					{renderSelection()}
					<Button variant='contained' component='label'>
						Select upload(s)
						<input
							type='file'
							accept='image/*'
							hidden
							onChange={handleSelect}
							multiple
						/>
					</Button>
					<Button
						startIcon={<CloudUploadIcon />}
						variant='contained'
						component='label'
						onClick={handleUpload}
						disabled={uploads.length < 1}
					>
						Upload
					</Button>
				</Box>
			</Paper>

			<LinearProgress
				variant={loading ? 'indeterminate' : 'determinate'}
				className={actionStyles.progressBar}
				value={0}
			/>

			<ImageGrid images={images} handleDelete={handleDelete} />
		</div>
	);
};

export default Images;
