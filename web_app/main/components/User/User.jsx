import React from 'react';
import { Container, Row, Button } from 'reactstrap';
import { getDisplayName } from '../../api/user/displayName';
import requireAuth from '../../tools/requireAuth';

class User extends React.Component {
 	constructor(props) {
 		super(props);

   		this.toJoinTournament = this.toJoinTournament.bind(this);
		this.toCreateTournament = this.toCreateTournament.bind(this);
	   	this.toCreateTeam = this.toCreateTeam.bind(this);
	   	this.toDisplayName = this.toDisplayName.bind(this);
	   	this.state = { displayName: '' };
	}
	
	componentDidMount() {
    	getDisplayName().then((fetchedDisplayName) => {
    		this.setState({ displayName: fetchedDisplayName });
    	});
  	}

  	toJoinTournament() { this.props.history.push('/tournament/find'); }

 	toCreateTournament() { this.props.history.push('/tournament/create'); }

  	toCreateTeam() { this.props.history.push('/team/create'); }

  	toDisplayName() { this.props.history.push('/user/displayname'); }

	render() {
		return (
			<Container>
				<Row>
					Hi { this.state.displayName }!
				</Row>
				<Row>
					<Button type='button' onClick={this.toJoinTournament}>Join a Tournament</Button>
					<Button type='button' onClick={this.toCreateTournament}>Create a Tournament</Button>
					<Button type='button' onClick={this.toCreateTeam}>Create a Team</Button>	
					<Button type='button' onClick={this.toDisplayName}>Update Your Display Name</Button>
				</Row>				
				<Row>
					Team invites:
				</Row>
				<Row>
					Tournaments You're Commisioning:
				</Row>
				<Row>
					manage tourney
				</Row>
				<Row>
					Tournaments You're Participating In:
				</Row>
				<Row>
					tourney
				</Row>
				<Row>
					Teams You're In:
				</Row>
				<Row>
					Teams
				</Row>
			</Container>
		);
	}
}

export default requireAuth(User);
