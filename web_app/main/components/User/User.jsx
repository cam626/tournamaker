import React from 'react';
import { Container, Row, Button } from 'reactstrap';
import getUser from '../../api/user/getUser';
import { getTeamsFromKeys } from '../../api/team/getTeam';
import getEventsFromKeys from '../../api/event/getEventsFromKeys';
import { getTournamentsFromKeys } from '../../api/tournament/getTournament';
import requireAuth from '../../tools/requireAuth';
import UserNav from './UserNav';
import TeamInviteCard from '../Team/TeamInviteCard';
import TeamCard from '../Team/TeamCard';
import TournamentCard from '../Tournament/TournamentCard';

class User extends React.Component {
 	constructor(props) {
 		super(props);

	   	this.state = { 
	   		loaded: false,
	   		user: {} 
	   	};
	}
	
	componentDidMount() {
    	if (!this.state.loaded) getUser().then((fetchedUser) => {
    		this.setState({ 
				loaded: true,
    			user: fetchedUser
    		});
    		getTeamsFromKeys(fetchedUser.team_invites).then((dict) => this.setState(dict));
    		getTeamsFromKeys(fetchedUser.teams).then((dict) => {
    			this.setState(dict);
    			Object.values(dict).forEach((team) => {
    				getEventsFromKeys(team.events).then((dict) => this.setState(dict));
    			});
    		});
    		getTournamentsFromKeys(fetchedUser.tournaments).then((dict) => this.setState(dict));
    	});
  	}

	render() {
		return (
			<Container>
					<h4 className="text-center">Hi { this.state.user.display_name }!</h4>
					<UserNav />	
				
				{
					this.state.user && this.state.user.team_invites &&
					<Row>
					Team invites:
					{
						this.state.user.team_invites.map((key) => this.state[key] && <TeamInviteCard update={this.update} key={key} api_key={key} {...this.state[key]} />)
					}
					</Row>
				}
				{
					this.state.user && this.state.user.tournaments &&
					<Row>
					Tournaments You're Commisioning:
					{
						this.state.user.tournaments.map((key) => this.state[key] && <TournamentCard key={key} {...this.state[key]} />)
					}
					</Row>
				}
				{
					this.state.user && this.state.user.teams &&
					<Row>
					Tournaments You're Participating In:
					{
						this.state.user.teams.map((team) => this.state[team] && this.state[team].events.map((key) => <TournamentCard team_name={this.state[team].name} key={key} {...this.state[key]} />))
					}
					</Row>
				}
				{
					this.state.user && this.state.user.teams &&
					<Row>
					Teams you're in:
					{
						this.state.user.teams.map((key) => this.state[key] && <TeamCard key={key} {...this.state[key]} />)
					}
					</Row>
				}
			</Container>
		);
	}
}

export default requireAuth(User);
