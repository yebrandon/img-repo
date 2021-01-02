import React, { useState, useEffect } from 'react';
import {
	Button,
	FormControlLabel,
	Checkbox,
	Paper,
	Tabs,
	Tab
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { auth, storage } from '../firebase';
import NavBar from './NavBar';

const Images = () => {
	const [uploads, setUploads] = useState([]);
	const [privateUpload, setPrivateUpload] = useState(false);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [imageURLs, setImageURLs] = useState([]);
	const [viewType, setViewType] = useState('public');
	const [error, setError] = useState('');
	let folderRef;

	useEffect(() => {
		setImageURLs([]);
		viewType === 'private' ? loadPrivate() : loadPublic();
	}, [viewType]);

	const loadPrivate = () => {
		folderRef = storage.ref(
			`images/private/${auth.currentUser.displayName}`
		);

		folderRef.list({ maxResults: 20 }).then((images) => {
			images.items.forEach((imageRef) => {
				imageRef.getDownloadURL().then((url) => {
					setImageURLs((prevState) => [...prevState, url]);
				});
			});
		});
	};

	const loadPublic = () => {
		folderRef = storage.ref('images/public');

		folderRef.list({ maxResults: 20 }).then((images) => {
			images.items.forEach((imageRef) => {
				imageRef.getDownloadURL().then((url) => {
					imageRef.getMetadata().then((metadata) => {
						if (
							metadata.customMetadata.uploadedBy ===
							auth.currentUser.displayName
						) {
							setImageURLs((prevState) => [...prevState, url]);
						}
					});
				});
			});
		});
	};

	const switchView = (event, newValue) => {
		setViewType(newValue);
	};

	const handleChoose = (event) => {
		setLoading(true);
		setUploads(Array.from(event.target.files));
		console.log(event.target.files);
		setLoading(false);
	};

	const handleCheck = (event) => {
		setPrivateUpload(event.target.checked);
	};

	const handleUpload = () => {
		const promises = uploads.map((upload) => {
			let storageRef;
			if (privateUpload) {
				storageRef = storage.ref(
					`images/private/${auth.currentUser.displayName}/${upload.name}`
				);
			} else {
				storageRef = storage.ref(`images/public/${upload.name}`);
			}

			const metadata = {
				customMetadata: {
					uploadedBy: auth.currentUser.displayName
				}
			};

			const uploadTask = storageRef.put(upload, metadata);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
					setProgress(progress);
				},
				(error) => {
					setError(error);
				},
				() => {
					storageRef.getDownloadURL().then((url) => {
						console.log(url);
					});
				}
			);
			return uploadTask;
		});
		Promise.all(promises)
			.then(() => {
				console.log('All files uploaded');
				setUploads([]);
			})
			.catch((error) => setError(error));
	};

	const renderImages = () => {
		return imageURLs.map((url, index) => {
			return <img key={index} src={url} />;
		});
	};

	const renderLoading = () => {
		if (loading) {
			return <div>Loading...</div>;
		} else if (uploads.length > 0) {
			if (uploads.length === 1) {
				return uploads[0].name;
			} else {
				return <div>Selected {uploads.length} images</div>;
			}
		}
	};

	const renderProgress = () => {
		if (progress < 100) {
			return <progress value={progress} max='100' />;
		} else {
			return <p>Done!</p>;
		}
	};

	return (
		<div>
			<NavBar />
			<Button variant='contained' component='label'>
				Choose upload(s)
				<input
					type='file'
					accept='image/*'
					hidden
					onChange={handleChoose}
					multiple
				/>
			</Button>
			<FormControlLabel
				control={
					<Checkbox
						checked={privateUpload}
						onChange={handleCheck}
						name='private'
					/>
				}
				label='Private'
			/>
			{renderLoading()}
			{renderProgress()}
			<Button
				startIcon={<CloudUploadIcon />}
				variant='contained'
				component='label'
				onClick={handleUpload}
				disabled={uploads.length < 1}
			>
				Upload
			</Button>
			<Paper square>
				<Tabs
					value={viewType}
					indicatorColor='primary'
					textColor='primary'
					onChange={switchView}
				>
					<Tab value='public' label='Public' />
					<Tab value='private' label='Private' />
				</Tabs>
			</Paper>
			{error}
			{renderImages()}
		</div>
	);
};

export default Images;
