import React, { useState, useEffect } from 'react';
import {
	Button,
	Paper,
	Tabs,
	Tab,
	Card,
	CardContent,
	CardMedia,
	CardActions,
	IconButton
} from '@material-ui/core';
import { CloudUpload, Delete } from '@material-ui/icons';
import { auth, storage } from '../firebase';
import NavBar from './NavBar';

const Images = () => {
	const [uploads, setUploads] = useState([]);
	const [progress, setProgress] = useState(0);
	const [images, setImages] = useState([]);
	const [view, setView] = useState('public');
	const [error, setError] = useState('');
	const storageRef = storage.ref(
		view === 'private'
			? `images/private/${auth.currentUser.displayName}`
			: 'images/public'
	);

	const loadImages = async () => {
		// use promise all to upload bulk rather than one after another?
		setImages([]);
		storageRef.list({ maxResults: 100 }).then((files) => {
			files.items.forEach((file) => {
				file.getDownloadURL().then((url) => {
					file.getMetadata().then((metadata) => {
						setImages((prevState) => [
							...prevState,
							{
								url,
								uploadedBy: metadata.customMetadata.uploadedBy,
								name: file.name,
								date: metadata.timeCreated
							}
						]);
					});
				});
			});
		});
	};

	useEffect(() => {
		console.log('useEffect');

		const filterPublic = () => {
			return images.filter(
				(image) => image.uploadedBy === auth.currentUser.displayName
			);
		};

		loadImages().then(() => {
			if (view === 'public') {
				filterPublic();
			} //clean up sort and it doesn't rly work
			images.sort((a, b) =>
				Date.parse(a.date) > Date.parse(b.date)
					? 1
					: Date.parse(b.date) > Date.parse(a.date)
					? -1
					: 0
			);
		});
	}, [view]);

	const switchView = (e, newValue) => {
		setView(newValue);
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
				(error) => {
					setError(error);
				},
				() => {
					fileRef.getDownloadURL().then((url) => {
						fileRef.getMetadata().then((metadata) => {
							setImages((prevState) => [
								...prevState,
								{
									url,
									uploadedBy:
										metadata.customMetadata.uploadedBy,
									name: storageRef.name,
									date: metadata.timeCreated
								}
							]);
						});
					});
				}
			);
			return uploadTask;
		});

		Promise.all(allUploads)
			.then(() => {
				console.log('All files uploaded');
				setUploads([]);
			})
			.catch((error) => setError(error));
	};

	const handleDelete = (name) => {
		storageRef
			.child(name)
			.delete()
			.then(() => {
				setImages(images.filter((image) => image.name !== name));
			})
			.catch((error) => {
				setError(error);
			});
	};

	const renderImages = () => {
		console.log('render');
		return images.map((image, index) => {
			return (
				<Card key={index}>
					<CardMedia component='img' src={image.url} />
					<CardContent>
						{image.uploadedBy}
						{image.date}
					</CardContent>
					<CardActions disableSpacing>
						<IconButton
							onClick={() => {
								handleDelete(image.name);
							}}
						>
							<Delete />
						</IconButton>
					</CardActions>
				</Card>
			);
		});
	};

	const renderSelection = () => {
		if (uploads.length > 0) {
			if (uploads.length === 1) {
				return uploads[0].name;
			} else {
				return <div>Selected {uploads.length} files</div>;
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
				Select upload(s)
				<input
					type='file'
					accept='image/*'
					hidden
					onChange={handleSelect}
					multiple
				/>
			</Button>

			{renderSelection()}
			{renderProgress()}
			<Button
				startIcon={<CloudUpload />}
				variant='contained'
				component='label'
				onClick={handleUpload}
				disabled={uploads.length < 1}
			>
				Upload
			</Button>
			<Paper square>
				<Tabs
					value={view}
					indicatorColor='primary'
					textColor='primary'
					onChange={switchView}
				>
					<Tab value='public' label='Public' />
					<Tab value='private' label='Private' />
				</Tabs>
			</Paper>
			{error}
			{images.length}
			{renderImages()}
		</div>
	);
};

export default Images;
