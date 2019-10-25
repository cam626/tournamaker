import Global from '../variables';
import firebase from 'firebase';
import Cookie from '../tools/cookie';

const setAuthToken = () => {
	return firebase.auth().currentUser.getIdToken().then((token) => {
		Global.authToken = token;
	});
};

const setAuthTokenCookie = () => { Cookie.set('tournamakerAuthToken', Global.authToken); };

const setAuthTokenFromCookie = () => { Global.authToken = Cookie.get('tournamakerAuthToken'); };

const deleteAuthTokenCookie = () => { Cookie.set('tournamakerAuthToken', ''); };

const isLoggedIn = () => { return !!firebase.auth().currentUser || Global.authToken; }

export { 
	setAuthToken,
	setAuthTokenCookie,
	setAuthTokenFromCookie,
	deleteAuthTokenCookie, 
	isLoggedIn 
};
