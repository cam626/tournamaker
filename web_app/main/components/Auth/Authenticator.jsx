import React from 'react';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { setAuthToken, setAuthTokenCookie, setAuthTokenFromCookie, 
	deleteAuthTokenCookie, isLoggedIn } from '../../api/authToken';

class Authenticator extends React.Component {
 	constructor(props) {
   		super(props);

   		this.signOut = this.signOut.bind(this);
	  	this.state = {
	   		isLoggedIn: false
	   	};
	}


  	signOut(e) {
  		e.preventDefault();
  		this.setState({ isLoggedIn: false });
  		firebase.auth().signOut().then(() => {
  			deleteAuthTokenCookie();
  			this.props.history.push('/');
  		});
  	}

	componentDidMount() {
    	this.setState({ isLoggedIn: isLoggedIn() });
    	this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => { 
				user && setAuthToken().then(() => setAuthTokenCookie());
				this.setState({ isLoggedIn: isLoggedIn() });
				setAuthTokenFromCookie();
			}
    	);
    	setAuthTokenFromCookie();
  	}

  	componentWillUnmount() { this.unregisterAuthObserver(); }

	render() {
		return this.props.page({
			signOut: this.signOut,
			isLoggedIn: this.state.isLoggedIn
		});
	}
}

export default withRouter(Authenticator);
