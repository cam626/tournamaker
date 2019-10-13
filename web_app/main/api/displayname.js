import { authToken } from '../../variables/user';
import backendHostUrl from '../../constants/backend';

const getDisplayName = () => {
	return fetch(`${backendHostUrl}/user`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	}).then((response) => response.displayName);
};

const updateDisplayName = (newName) => {
	return fetch(`${backendHostUrl}/user`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		body: JSON.stringify({
			displayName: newName
		})
	});
};

export {
	getDisplayName,
	updateDisplayName
};
