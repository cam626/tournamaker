import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const createTournament = (tournament) => {
	return fetch(`${backendHostUrl}tournament`, {
		method: 'POST',
		headers: headers(Global.authToken),
		body: JSON.stringify(tournament)
	}).then((response) => defaultResponse(response))
};

export default createTournament;
