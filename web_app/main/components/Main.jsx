const React = require('react');
const Nav = require('Nav');

module.exports = (props) => (
	<div>
		<Nav/>
		{props.children}
	</div>
);