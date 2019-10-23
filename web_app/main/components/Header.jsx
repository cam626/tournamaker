import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink, withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { setAuthToken } from '../api/authToken';

class Header extends React.Component {
 	constructor(props) {
   		super(props);

   		this.signOut = this.signOut.bind(this);
	   	this.toggle = this.toggle.bind(this);
	   	this.state = {
	   		isOpen: false,
	   		loggedIn: false
	   	};
	}

	toggle() { this.setState({ isOpen: !this.state.isOpen }); }

  	signOut(e) {
  		e.preventDefault();
  		firebase.auth().signOut().then(() => {
  			this.setState({ loggedIn: false });
  			this.props.history.push('/');
  		});
  	}

	componentDidMount() {
    	this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => { 
				user && setAuthToken();
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
							{
								this.state.loggedIn ?
								<div>
									<NavLink to='/user' tag={RRNavLink}>User</NavLink>
									<NavLink onClick={this.signOut}>Log Out</NavLink>
								</div>
								: <NavLink to='/signin' tag={RRNavLink}>Sign In</NavLink>
							}
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}

export default withRouter(Header);