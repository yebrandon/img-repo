import React from 'react';
import NavBar from './NavBar';
import { storage } from '../firebase';
import ImageGrid from './ImageGrid';

const Home = () => {
	return (
		<React.Fragment>
			<NavBar />
			<ImageGrid
				deleteEnabled={false}
				storageRef={storage.ref('images/public')}
				filterUsers={false}
				newImages={[]}
			/>
		</React.Fragment>
	);
};

export default Home;
