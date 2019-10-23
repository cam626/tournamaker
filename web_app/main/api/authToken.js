import Global from '../variables';
import firebase from 'firebase';

const setAuthToken = () => {
	return firebase.auth().currentUser.getIdToken().then((token) => {
		Global.authToken = token;
	});
};

export { setAuthToken };