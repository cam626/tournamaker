import React from 'react';
import Link from 'react-router-dom';

export default () => {
	return (
		<div>
			<h1>Page Not Found</h1>
			<p>Sorry, but the page you were trying to view does not exist.</p>
			<Link to='/'>Go to Home</Link>
		</div>
	);
};
