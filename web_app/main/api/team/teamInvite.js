import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const teamInvite = (teamKey, bool) => {
	return fetch(`${backendHostUrl}user/${teamKey}/${bool ? 'accept' : 'decline'}`, {
		method: bool ? 'PATCH' : 'DELETE',
		headers: headers(Global.authToken)
	}).then((response) => defaultResponse(response))
	.then((response) => response.display_name);
};

export default teamInvite;
