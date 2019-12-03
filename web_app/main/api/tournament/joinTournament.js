import Global from '../../variables';
import backendHostUrl from '../../constants/backend';
import defaultResponse from '../defaultResponse';
import headers from '../headers';

const joinTournament = (tournament_key, team_key) => {
	return fetch(`${backendHostUrl}tournament/${tournament_key}/signup/${team_key}`, {
		method: 'POST',
		headers: headers(Global.authToken)
	}).then((response) => defaultResponse(response))
};

export default joinTournament;
