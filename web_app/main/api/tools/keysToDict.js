import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const keysToDict = (entity) => {
	return 	(list) => {
		return fetch(`${backendHostUrl}${entity}/keys/convert`, {
			method: 'POST',
			headers: headers(Global.authToken),
			body: JSON.stringify({ keys: list })
		}).then((response) => defaultResponse(response))
	};	
};

export default keysToDict;
