import React from 'react';
import { Container, Row, Button } from 'reactstrap';
import getUser from '../../api/user/getUser';
import { getTeamsFromKeys } from '../../api/team/getTeam';
import getEventsFromKeys from '../../api/event/getEventsFromKeys';
import requireAuth from '../../tools/requireAuth';
import UserNav from './UserNav';
import TeamInviteCard from '../Team/TeamInviteCard';
import TeamCard from '../Team/TeamCard';
import TournamentCard from '../Tournament/TournamentCard';

class User extends React.Component {
 	constructor(props) {
 		super(props);

	   	this.update = this.update.bind(this);
	   	this.state = { user: {} };
	}
	
	componentDidMount() {
    	getUser().then((fetchedUser) => {
    		this.setState({ user: fetchedUser });
    		getTeamsFromKeys(fetchedUser.team_invites).then((dict) => this.setState(dict));
    		getTeamsFromKeys(fetchedUser.teams).then((dict) => {
    			this.setState(dict);
    			Object.values(dict).forEach((team) => {
    				getEventsFromKeys(team.events).then((dict) => this.setState(dict));
    			});
    		});
    	});
  	}

  	update() {this.componentDidMount()}

	render() {
		return (
			<Container>
				<Row>
					<UserNav />
				</Row>				
				<Row>
					Hi { this.state.user.display_name }!
				</Row>
				{
					this.state.user && this.state.user.team_invites &&
					<Row>
					Team invites:
					{
						this.state.user.team_invites.map((key) => <TeamInviteCard update={this.update} key={key} api_key={key} {...this.state[key]} />)
					}
					</Row>
				}
				{
					this.state.user && this.state.user.tournaments &&
					<Row>
					Tournaments You're Commisioning:
					{
						this.state.user.tournaments.map((key) => <TournamentCard key={key} {...this.state[key]} />)
					}
					</Row>
				}
				{
					this.state.user && this.state.user.teams &&
					<Row>
					Tournaments You're Participating In:
					{
						this.state.user.teams.map((team) => team.events.map((key) => <TournametCard key={key} {...this.state[key]} />))
					}
					</Row>
				}
				{
					this.state.user && this.state.user.teams &&
					<Row>
					Teams you're in:
					{
						this.state.user.teams.map((key) => <TeamCard key={key} {...this.state[key]} />)
					}
					</Row>
				}
			</Container>
		);
	}
}

export default requireAuth(User);
