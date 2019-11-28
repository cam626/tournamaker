import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const createEntityEndpoint = (entity) => {
	return 	(obj) => {
		return fetch(`${backendHostUrl}${entity}`, {
			method: 'POST',
			headers: headers(Global.authToken),
			body: JSON.stringify(obj)
		}).then((response) => defaultResponse(response))
	};	
};

export default createEntityEndpoint;
