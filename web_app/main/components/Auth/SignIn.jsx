import React from 'react';
import { Container, Row, Alert } from 'reactstrap';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import firebaseConfig from '../../constants/firebaseConfig';
import { getDisplayName } from '../../api/user/displayName';
import { setAuthToken, setAuthTokenCookie } from '../../api/authToken';
import queryString from 'query-string';

firebase.initializeApp(firebaseConfig);

const uiConfig = {
	callbacks: { signInSuccessWithAuthResult: () => false },
	signInOptions: [
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
		{
			provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			scopes: [
				'https:\/\/www.googleapis.com/auth/userinfo.email'
			]
		}
	],
	signInFlow: 'popup',
	// Terms of service url.
	tosUrl: () => {},
	// Privacy policy url.
	privacyPolicyUrl: () => {}
};

export default class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = { redirect : '' };
	}

	componentDidMount() {
    	const params = queryString.parse(this.props.location.search);
  		let loggedInGoto = '/user/dashboard';
  		if (params && 'redirect' in params) {
  			this.setState({ redirect : params.redirect });
  			loggedInGoto = params.redirect;
  		}
    	this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => { 
				if (user) setAuthToken().then(() => {
					setAuthTokenCookie();
					getDisplayName().then((displayname) => {
    					displayname ? this.props.history.push(loggedInGoto)
						: this.props.history.push('/user/displayname');
					});
				});
			}
    	);
  	}

  	componentWillUnmount() { this.unregisterAuthObserver(); }

	render() {
		return (
			<Container>
				<h1 className="text-center">Sign in to Tournamaker</h1>
				{
					this.state.redirect &&
					<Alert color='danger' className="text-center">You cannot access the {this.state.redirect} page without logging in.</Alert>
				}
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
				<h4 className="text-center">Note: we use cookies to keep you logged in!</h4>
			</Container>
		);
	}
}
