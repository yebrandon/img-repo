import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { auth, storage } from '../firebase';

const Home = () => {
	const [imageURLs, setImageURLs] = useState([]);

	const renderImages = () => {
		return imageURLs.map((url, index) => {
			return <img key={index} src={url} />;
		});
	};

	useEffect(() => {
		setImageURLs([]);
		const folderRef = storage.ref('images/public');
		folderRef.list({ maxResults: 20 }).then((images) => {
			images.items.forEach((imageRef) => {
				imageRef.getDownloadURL().then((url) => {
					setImageURLs((prevState) => [...prevState, url]);
				});
			});
		});
	}, []);

	return (
		<React.Fragment>
			<NavBar />
			{renderImages()}
		</React.Fragment>
	);
};

export default Home;
