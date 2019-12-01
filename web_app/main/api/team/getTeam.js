import getEntityEndpoint from '../tools/getEntityEndpoint';
import keysToDict from '../tools/keysToDict';

const getTeam = getEntityEndpoint('team');

const getTeamsFromKeys = keysToDict('team');

export {
	getTeam,
	getTeamsFromKeys
}
