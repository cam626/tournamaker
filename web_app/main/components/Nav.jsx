const React = require('react');
const {Link} = require('react-router');

module.exports = () => (
	<div>
		<Link to="/">Get Weather</Link>
		<Link to="/about">About</Link>
		<Link to="/examples">Examples</Link>
	</div>
);	