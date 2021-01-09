import React from 'react';
import {
	GridList,
	GridListTile,
	GridListTileBar,
	IconButton,
	makeStyles
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';

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
	// Allow image to fill tile and maintain aspect ratio
	picture: {
		minWidth: '100%',
		minHeight: '100%',
		transform: 'translate(-50%, -50%)',
		position: 'relative',
		left: '50%',
		top: '50%'
	}
}));

const ImageGrid = ({ images, handleDelete = null }) => {
	const gridStyles = useGridStyles();

	// Sorts images by date in descending order when used with .sort
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

	return (
		<GridList cellHeight={400} cols={4} className={gridStyles.gridList}>
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
							title={
								image.name.slice(
									0,
									image.name.indexOf('|')
								) /* Display image name with username removed*/
							}
							subtitle={`${image.uploadedBy} - ${new Date(
								image.date
							).toDateString()}`}
							titlePosition='top'
							actionIcon={
								handleDelete ? (
									<IconButton
										onClick={() => {
											handleDelete(image.name);
										}}
										className={gridStyles.icon}
									>
										<Delete />
									</IconButton>
								) : null /* Don't render delete button if not specified */
							}
						/>
					</GridListTile>
				))}
		</GridList>
	);
};

export default ImageGrid;
