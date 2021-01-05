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
	IconButton,
	Container,
	GridList,
	GridListTile,
	GridListTileBar,
	CircularProgress,
	LinearProgress,
	Divider,
	Box
} from '@material-ui/core';
import { CloudUpload, Delete } from '@material-ui/icons';
import { auth, storage } from '../firebase';
import NavBar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	gridList: { width: '100%', height: '100%' },
	gridTile: { width: '25%', height: '25%' },
	titleBar: {
		background:
			'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
			'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
	},
	icon: {
		color: 'white'
	},
	progressBar: {},
	divider: { margin: 10 },
	toolBar: {
		flexDirection: 'row',
		display: 'flex',
		alignItems: 'center'
	},
	uploadGroup: {
		alignItems: 'center',
		marginLeft: 'auto'
	}
}));

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

	const classes = useStyles();

	const loadImages = async () => {
		setImages([]);
		storageRef.list({ maxResults: 100 }).then((files) => {
			files.items.forEach((file) => {
				file.getDownloadURL().then((url) => {
					file.getMetadata().then((metadata) => {
						setImages((prevState) => [
							{
								url,
								uploadedBy: metadata.customMetadata.uploadedBy,
								name: file.name,
								date: metadata.timeCreated
							},
							...prevState
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
								{
									url,
									uploadedBy:
										metadata.customMetadata.uploadedBy,
									name: storageRef.name,
									date: metadata.timeCreated
								},
								...prevState
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
				setProgress(0);
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
		return (
			<GridList cellHeight='400' cols='4' className={classes.gridList}>
				{images.map((image, index) => (
					<GridListTile className={classes.gridTile} key={index}>
						<img src={image.url} alt='' />
						<GridListTileBar
							className={classes.titleBar}
							title={image.uploadedBy}
							subtitle={new Date(image.date).toDateString()}
							titlePosition='top'
							actionIcon={
								<IconButton
									onClick={() => {
										handleDelete(image.name);
									}}
									className={classes.icon}
								>
									<Delete />
								</IconButton>
							}
						/>
					</GridListTile>
				))}
			</GridList>
		);
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
		return (
			<LinearProgress
				className={classes.progressBar}
				variant='determinate'
				value={progress}
			/>
		);
	};

	return (
		<div>
			<NavBar />
			<Paper square className={classes.toolBar}>
				<Tabs
					value={view}
					indicatorColor='primary'
					textColor='primary'
					onChange={switchView}
					variant='fullWidth'
				>
					<Tab value='public' label='Public' />
					<Tab value='private' label='Private' />
				</Tabs>
				<Box className={classes.uploadGroup}>
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
						startIcon={<CloudUpload />}
						variant='contained'
						component='label'
						onClick={handleUpload}
						disabled={uploads.length < 1}
					>
						Upload
					</Button>
				</Box>
			</Paper>
			{renderProgress()}
			{error}
			<div>{renderImages()}</div>
		</div>
	);
};

export default Images;
