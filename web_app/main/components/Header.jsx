import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header>
			<Navbar bg='light' expand='lg' sticky='top'>
				<Navbar.Brand>
					<Link to='/'>React-Bootstrap</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='mr-auto'>
						<LinkContainer to='/'>
							<NavItem>Home</NavItem>
						</LinkContainer>
						<LinkContainer to='/signin'>
							<NavItem>Sign In</NavItem>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</header>
	);
};

export default Header;
