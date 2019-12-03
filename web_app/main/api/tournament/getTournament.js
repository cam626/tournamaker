import getEntityEndpoint from '../tools/getEntityEndpoint';
import keysToDict from '../tools/keysToDict';

const getTournament = getEntityEndpoint('tournament');

const getTournamentsFromKeys = keysToDict('team');

export {
	getTournament,
	getTournamentsFromKeys
}
