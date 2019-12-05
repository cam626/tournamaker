import getEntityEndpoint from '../tools/getEntityEndpoint';
import keysToDict from '../tools/keysToDict';

const getTournament = getEntityEndpoint('tournament');

const getTournamentsFromKeys = keysToDict('event');

export {
	getTournament,
	getTournamentsFromKeys
}
