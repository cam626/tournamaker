import Global from '../variables';
import backendHostUrl from '../constants/backend';
import defaultResponse from './defaultResponse';
import headers from './headers';

const getDisplayName = () => {
	return fetch(`${backendHostUrl}user`, {
		method: 'GET',
		headers: headers(Global.authToken)
	}).then((response) => defaultResponse(response))
	.then((response) => response.display_name)
	.catch(() => '');
};

const updateDisplayName = (newName) => {
	return fetch(`${backendHostUrl}user`, {
		method: 'PATCH',
		headers: headers(Global.authToken),
		body: JSON.stringify({
			display_name: newName
		})
	}).then((response) => defaultResponse(response))
	.then((response) => response.display_name);
};

export {
	getDisplayName,
	updateDisplayName
};
