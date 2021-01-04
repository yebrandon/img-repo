import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { auth, storage } from '../firebase';
import { Card, CardMedia, CardContent } from '@material-ui/core';

const Home = () => {
	const [images, setImages] = useState([]);
	const storageRef = storage.ref('images/public');

	useEffect(() => {
		setImages([]);
		loadImages();
	}, []);

	const renderImages = () => {
		return images.map((image, index) => {
			return (
				<Card key={index}>
					<CardMedia component='img' src={image.url} />
					<CardContent>
						{image.uploadedBy}
						{image.date}
					</CardContent>
				</Card>
			);
		});
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
