import React, { useState } from 'react';
import {
	Button,
	Paper,
	Tabs,
	Tab,
	LinearProgress,
	Box,
	Typography
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
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
	const [storageRef, setStorageRef] = useState(storage.ref('images/public'));
	const [view, setView] = useState('public');
	const [uploads, setUploads] = useState([]);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState('');
	const [newImages, setNewImages] = useState([]);
	const actionStyles = useActionStyles();

	const switchView = (e, newValue) => {
		setView(newValue);
		setStorageRef(
			storage.ref(
				newValue === 'private'
					? `images/private/${auth.currentUser.displayName}`
					: 'images/public'
			)
		);
	};

	const handleSelect = (e) => {
		setUploads(Array.from(e.target.files));
	};

	const handleUpload = () => {
		const allUploads = uploads.map((upload) => {
			const metadata = {
				customMetadata: {
					uploadedBy: auth.currentUser.displayName
				}
			};
			const fileRef = storageRef.child(upload.name);
			const uploadTask = fileRef.put(upload, metadata);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					setProgress(
						Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) *
								100
						)
					);
				},
				() => {
					setError('Error uploading files');
				},
				() => {
					setNewImages((prevState) => [...newImages, ...prevState]);
				}
			);
			return uploadTask;
		});

		Promise.all(allUploads).then(() => {
			setUploads([]);
			setProgress(0);
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
				className={actionStyles.progressBar}
				variant='determinate'
				value={progress}
			/>
			<ImageGrid
				enableDelete={true}
				filterUsers={true}
				storageRef={storageRef}
				newImages={newImages}
			/>
		</div>
	);
};

export default Images;
