import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import NavBar from './NavBar';
import ImageGrid from './ImageGrid';

const Home = () => {
	const [images, setImages] = useState([]);

	useEffect(() => {
		const storageRef = storage.ref('images/public');

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

		const loadAllImages = () => {
			storageRef.list({ maxResults: 100 }).then((files) => {
				files.items.forEach((fileRef) => {
					loadImage(fileRef);
				});
			});
		};

		setImages([]);
		loadAllImages();
	}, []);

	return (
		<React.Fragment>
			<NavBar />
			<ImageGrid images={images} />
		</React.Fragment>
	);
};

export default Home;
