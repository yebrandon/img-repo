import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { auth, storage } from '../firebase';
import {
	Card,
	CardMedia,
	CardContent,
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton
} from '@material-ui/core';
import { CloudUpload, Delete } from '@material-ui/icons';
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

const Home = () => {
	const [images, setImages] = useState([]);
	const storageRef = storage.ref('images/public');

	const classes = useStyles();

	useEffect(() => {
		setImages([]);
		loadImages();
	}, []);

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
						/>
					</GridListTile>
				))}
			</GridList>
		);
	};

	const loadImages = () => {
		storageRef.list({ maxResults: 100 }).then((files) => {
			files.items.forEach((storageRef) => {
				storageRef.getDownloadURL().then((url) => {
					storageRef.getMetadata().then((metadata) => {
						setImages((prevState) => [
							...prevState,
							{
								url,
								uploadedBy: metadata.customMetadata.uploadedBy,
								name: storageRef.name,
								date: metadata.timeCreated
							}
						]);
					});
				});
			});
		});
	};

	return (
		<React.Fragment>
			<NavBar />
			{renderImages()}
		</React.Fragment>
	);
};

export default Home;
