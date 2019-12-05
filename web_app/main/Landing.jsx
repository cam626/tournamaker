import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

const Landing = () => {
	return (
		<div>
			<header className="masthead">
    			<div className="container d-flex h-100 align-items-center">
      				<div className="mx-auto text-center">
        				<h1 className="mx-auto my-0 text-uppercase">Tournamaker</h1>
        				<h2 className="text-white-50 mx-auto mt-5">Tournament Schedule Generation and Statistic Tracking</h2>
                <h2 className="text-white-50 mx-auto mt-5 mb-5">Competition Reimagined</h2>
        				<NavLink className="btn btn-primary js-scroll-trigger" to='/signin'>Get Started</NavLink>
      				</div>
    			</div>
  			</header>
		</div>
	);
};

export default withRouter(Landing);
