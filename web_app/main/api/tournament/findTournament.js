import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const findTournament = (display_name, tournament_name) => {
	return fetch(`${backendHostUrl}tournament/${display_name}/${tournament_name}`, {
		method: 'GET',
		headers: headers(Global.authToken)
	}).then((response) => defaultResponse(response))
};

export default findTournament;
