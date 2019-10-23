import React from 'react';
import { Container, Row } from 'reactstrap';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import firebaseConfig from '../../constants/firebaseConfig';
import Global from '../../variables';
import { getDisplayName } from '../../api/displayName';
import { setAuthToken } from '../../api/authToken';

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
	componentDidMount() {
    	this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => {
				if (user) {
					setAuthToken().then(() => {
						getDisplayName().then((displayname) => {
							displayname ? this.props.history.push('/user')
							: this.props.history.push('/user/displayname');
						});
					});
				}
			}
    	);
  	}

	render() {
		return (
			<Container>
				<Row>
					<h1>Sign in to Tournamaker</h1>
				</Row>
				<Row>
					<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
				</Row>
			</Container>
		);
	}
}
