import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import firebase from 'firebase';

export default class Header extends React.Component {
 	constructor(props) {
   		super(props);

	   	this.toggle = this.toggle.bind(this);
	   	this.state = {
	   		isOpen: false,
	   		loggedIn: false
	   	};
	}

	toggle() {
		this.setState({ isOpen: !this.state.isOpen });
  	}

  	signOut(e) {
  		e.preventDefault();
  		firebase.auth().signOut();
  		window.location.assign('/');
  	}

	componentDidMount() {
    	this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => {
				this.setState({ loggedIn: !!user });
			}
    	);
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
							{this.state.loggedIn ?
								<NavLink onClick={this.signOut}>Log Out</NavLink>
								: <NavLink to='/signin' tag={RRNavLink}>Sign In</NavLink>
							}
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
