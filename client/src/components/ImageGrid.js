import React, { useEffect, useState } from 'react';
import {
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import { auth } from '../firebase';

const useGridStyles = makeStyles(() => ({
	gridList: { width: '100%', height: '100%' },
	gridTile: { width: '25%', height: '25%' },
	gridTitleBar: {
		background:
			'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
			'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
	},
	icon: {
		color: 'white'
	},
	picture: {
		minWidth: '100%',
		minHeight: '100%',
		transform: 'translate(-50%, -50%)',
		position: 'relative',
		left: '50%',
		top: '50%'
	}
}));

const ImageGrid = ({ enableDelete, filterUsers, storageRef, newImages }) => {
	const [images, setImages] = useState([]);
	const gridStyles = useGridStyles();

	useEffect(() => {
		const loadAllImages = async () => {
			setImages([]);
			storageRef.list({ maxResults: 100 }).then((files) => {
				files.items.forEach((fileRef) => {
					loadImage(fileRef);
				});
			});
		};

		loadAllImages().then(() => {
			if (filterUsers) {
				images.filter(
					(image) => image.uploadedBy === auth.currentUser.displayName
				);
			}
		});
	}, [storageRef, filterUsers, newImages]);

	const loadImage = (fileRef) => {
		fileRef.getDownloadURL().then((url) => {
			fileRef.getMetadata().then((metadata) => {
				setImages((prevState) => [
					{
						url,
						uploadedBy: metadata.customMetadata.uploadedBy,
						name: fileRef.name,
						date: metadata.timeCreated
					},
					...prevState
				]);
			});
		});
	};

	const sortByDate = (image1, image2) => {
		const date1 = Date.parse(image1.date);
		const date2 = Date.parse(image2.date);

		if (date1 > date2) {
			return -1;
		} else if (date2 > date1) {
			return 1;
		}
		return 0;
	};

	const handleDelete = (name) => {
		storageRef
			.child(name)
			.delete()
			.then(() => {
				setImages(images.filter((image) => image.name !== name));
			})
			.catch((err) => {
				return err;
			});
	};

	return (
		<GridList cellHeight='400' cols={4} className={gridStyles.gridList}>
			{images
				.sort((image1, image2) => sortByDate(image1, image2))
				.map((image, index) => (
					<GridListTile
						className={useGridStyles.gridTile}
						key={index}
					>
						<a
							href={image.url}
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={image.url}
								alt=''
								className={gridStyles.picture}
							/>
						</a>
						<GridListTileBar
							className={gridStyles.gridTitleBar}
							title={image.uploadedBy}
							subtitle={new Date(image.date).toDateString()}
							titlePosition='top'
							actionIcon={
								enableDelete ? (
									<IconButton
										onClick={() => {
											handleDelete(image.name);
										}}
										className={gridStyles.icon}
									>
										<Delete />
									</IconButton>
								) : null
							}
						/>
					</GridListTile>
				))}
		</GridList>
	);
};

export default ImageGrid;
