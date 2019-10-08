import React from 'react';
import { Container } from 'reactstrap';
import firebase from 'firebase';
import firebaseui from 'firebaseui';

export default class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.ui = new firebaseui.auth.AuthUI(firebase.auth());
		this.uiConfig = {
			allbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    		}
  		},
			signInOptions: [
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				{
					provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					scopes: [
						'https://www.googleapis.com/auth/contacts.readonly'
					]
				}
			]
		};
		this.props.history.push('/user');
	}

	ComponentDidMount() {
		this.ui.start('#firebaseui-auth-container', this.uiConfig);
	}

	render() {
		return (
			<Container>
				<h1>Sign in to Tournamaker</h1>
				<div id='firebaseui-auth-container' />
				<h3 id='loader'>Loading...</h3>
			</Container>
		);
	}
}
