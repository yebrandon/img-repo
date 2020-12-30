import React, { useState } from 'react';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { auth, storage } from '../firebase';

const Images = () => {
	const [uploads, setuploads] = useState([]);
	const [isPrivate, setIsPrivate] = useState(false);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleChoose = (event) => {
		setLoading(true);
		setuploads(Array.from(event.target.files));
		console.log(event.target.files);
		setLoading(false);
	};

	const handleCheck = (event) => {
		setIsPrivate(event.target.checked);
	};

	const handleUpload = () => {
		const promises = uploads.map((upload) => {
			const uploadTask = storage
				.ref(
					`images/${auth.currentUser.email}/${
						isPrivate ? 'private' : 'public'
					}/${upload.name}`
				)
				.put(upload);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
					setProgress(progress);
				},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref(
							`images/${auth.currentUser.email}/${
								isPrivate ? 'private' : 'public'
							}/${upload.name}`
						)
						.getDownloadURL()
						.then((url) => {
							console.log(url);
						});
				}
			);
			return uploadTask;
		});
		Promise.all(promises)
			.then(() => console.log('All files uploaded'))
			.catch((err) => console.log(err.code));
	};

	const renderLoading = () => {
		console.log(uploads.length);
		if (loading) {
			return <div>Loading...</div>;
		} else if (uploads.length > 0) {
			if (uploads.length === 1) {
				return uploads[0].name;
			} else {
				return <div>Uploading {uploads.length} images</div>;
			}
		}
	};

	return (
		<div>
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
						checked={isPrivate}
						onChange={handleCheck}
						name='private'
					/>
				}
				label='Private'
			/>
			{renderLoading()}
			{progress}
			<progress value={progress} max='100' />
			<Button
				startIcon={<CloudUploadIcon />}
				variant='contained'
				component='label'
				onClick={handleUpload}
			>
				Upload
			</Button>
		</div>
	);
};

export default Images;
