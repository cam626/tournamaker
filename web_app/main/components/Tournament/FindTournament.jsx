import React from 'react';
import { Container, Row, Col, Label, Button, Input, CustomInput, 
	Form, FormGroup, FormFeedback, FormText, ListGroup, ListGroupItem } from 'reactstrap';
import TournamentCard from './TournamentCard';
import findTournament from '../../api/tournament/findTournament';
import joinTournament from '../../api/tournament/joinTournament';
import getUser from '../../api/user/getUser';
import { getTeamsFromKeys } from '../../api/team/getTeam';
import requireAuth from '../../tools/requireAuth';

class FindTournament extends React.Component {
 	constructor(props) {
   		super(props);

   		this.toUser = this.toUser.bind(this);
	   	this.handleDNameChange = this.handleDNameChange.bind(this);
	   	this.handleTNameChange = this.handleTNameChange.bind(this);
		this.handleFindTournament = this.handleFindTournament.bind(this);
		this.handleTeamChange = this.handleTeamChange.bind(this);

	   	this.state = {
	   		error: '',
	   		dname: '',
	   		tname: '',
	   		team: '',
	   		dnameError: false,
	   		tnameError: false,
	   		teamError: false,
	   		tournament_key: '',
	   		tournament: null,
	   		teams: []
	   	};
	}

	componentDidMount() {
		console.log(!!this.state.tournament);
		getUser().then((fetchedUser) => {
    		this.setState({ teams: fetchedUser.teams });
    		getTeamsFromKeys(fetchedUser.teams).then((dict) => this.setState(dict));
    	});
	}

  	toUser() { this.props.history.push('/user'); }

	handleDNameChange(e) { 
		this.setState({ 
			dname: e.target.value.trim(),
			dnameError: e.target.value ? false : true
		});
	}
	handleTNameChange(e) { 
		this.setState({ 
			tname: e.target.value.trim(),
			tnameError: e.target.value ? false : true
		});
	}
	handleTeamChange(e) { 
		this.setState({ 
			team: e.target.value,
			teamError: e.target.value ? false : true
		});
	}
	handleFindTournament() { 
		if (!this.state.dname || !this.state.tname) {
			this.setState({
				dnameError: this.state.dname ? false : true,
				tnameError: this.state.tname ? false : true
			});
		} else return findTournament(this.state.dname, this.state.tname)
		.catch((newError) => {
			this.setState({
				tournament_key: '',
				tournament: null,
				error: `Error: ${newError}`
			}); 
		}).then((newTournament) => {
			this.setState({ 
				tournament: newTournament.tournament,
				tournament_key: newTournament.tournament_key
			});
		});
	}

  	submit(e) {
  		e.preventDefault();

  		if (!this.state.tournament_key) {
  			this.setState({ error: 'Error: you must find a Tournament, use the Find Tournament button' });
  			return;
		}

  		if (!this.state.team) {
  			this.setState({ error: 'Error: you must choose a Team' });
  			return;
		}

  		this.setState({ error: '' });

  		joinTournament(this.state.tournament_key, this.state.team).then(() => { this.toUser(); })
  		.catch((newError) => { this.setState({ error: `Error: ${newError}` }); });
  	}

	render() {
		return (
			<Container>
				<Row>
					Create a new Team
				</Row>
				<Row>
					<Button type='button' onClick={this.toUser}>Return to User</Button>
				</Row>
				<Row>
					<Form onSubmit={ (e) => this.submit(e) }>
						<FormGroup row>
							<Label for="d_name" md={4}>Tournament Commisioner Display Name</Label>
							<Col md={8}>
								<Input type='text' name='d_name' id='d_name' placeholder='Display Name'
									onChange={this.handleDNameChange}
									invalid={this.state.dnameError}
									onKeyPress={(e) => { 
										if (e.key === 'Enter') {
											e.preventDefault();
											this.handleFindTournament(); 
										}
									}}
								/>
								<FormFeedback>You must choose a commisioner name</FormFeedback>
							</Col>		
						</FormGroup>
						<FormGroup row>
							<Label for="t_name" md={4}>Tournament Name</Label>
							<Col md={8}>
								<Input type='text' name='t_name' id='t_name' placeholder="Tournament Name"
									onChange={this.handleTNameChange} 
									invalid={this.state.tnameError}
									onKeyPress={(e) => { 
										if (e.key === 'Enter') {
											e.preventDefault();
											this.handleFindTournament(); 
										}
									}}
								/>
								<FormFeedback>You must choose a tournament name</FormFeedback>	
							</Col>
						</FormGroup>
						<Button type="button" onClick={this.handleFindTournament}>Find Tournament</Button>
						{
							this.state.tournament &&
							<TournamentCard {...this.state.tournament} />
						}
						<FormGroup row>
							<Label for="team" md={2}>Team</Label>
							<Col md={8}>
								<Input type="select" name="team" id="team" 
									onChange={this.handleTeamChange} 
									invalid={this.state.teamError}
								>
          								<option value={''}>----</option>
          								{
          									this.state.teams.map((key) => <option key={key} value={key}>{this.state[key] && this.state[key].name}</option>)
          								}
        							</Input>
									<FormText>The team you will be registering for the tournament with</FormText>	
									<FormFeedback>You must choose a team</FormFeedback>	
							</Col>
						</FormGroup>						
						{
							this.state.error && 
							<h3>{this.state.error}</h3>
						}
						<Button>Join Tournament</Button>
					</Form>
				</Row>
			</Container>
		);
	}
}

export default requireAuth(FindTournament);
