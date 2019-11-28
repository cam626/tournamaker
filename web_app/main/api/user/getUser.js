import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const getUser = () => {
	return fetch(`${backendHostUrl}/user`, {
		method: 'GET',
		headers: headers(Global.authToken)
	}).then((response) => defaultResponse(response))
};

export default getUser;
