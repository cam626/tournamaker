import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

export default class Header extends React.Component {
 	constructor(props) {
   		super(props);

	   	this.toggle = this.toggle.bind(this);
	   	this.state = { isOpen: false };
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
	    });
  	}

	render() {
		return (
			<Navbar color='light' light expand='md' sticky='top'>
				<NavbarBrand to='/' tag={RRNavLink}>Tournamaker</NavbarBrand>
				<NavbarToggler onClick={this.toggle} />
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className='ml-auto' navbar>
						<NavItem>
							<NavLink to='/' tag={RRNavLink}>Home</NavLink>
						</NavItem>
						<NavItem>
							<NavLink to='/signin' tag={RRNavLink}>Sign In</NavLink>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
