import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const getEntityEndpoint = (entity) => {
	return (key) => {
		return fetch(`${backendHostUrl}${entity}/${key}`, {
			method: 'GET',
			headers: headers(Global.authToken)
		}).then((response) => defaultResponse(response))
	};
};

export default getEntityEndpoint;
