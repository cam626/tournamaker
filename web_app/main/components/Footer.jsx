import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

const Footer = (props) => {
    return (
	<footer className={props.location.pathname == '/home' || props.location.pathname == '/' ? 'about-section text-white' : ''}>
		<div className="container text-center">
    	    Check out our <NavLink to='/api'>API!</NavLink>
    	</div>
    	<div className="container text-center">
    	 	<a href="https://github.com/cam626/tournamaker" className="mx-4">
    	      <i className="fab fa-github"></i>
    	    </a> 
    	    Copyright &copy; Tournamaker 2019
    	</div>
	</footer>
	);
};

export default withRouter(Footer);
