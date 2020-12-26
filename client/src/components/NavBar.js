import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img/logo.png';

const NavBar = () => {
	const [activeItem, setActiveItem] = useState('home');

	const handleItemClick = (e, { name }) => {
		setActiveItem(name);
	};

	return <div></div>;
};

export default NavBar;
