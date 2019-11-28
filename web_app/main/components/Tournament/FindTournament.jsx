import React from 'react';
import { Container, Row, Col, Label, Button, Input, CustomInput, 
	Form, FormGroup, FormFeedback, FormText, ListGroup, ListGroupItem } from 'reactstrap';
import createTeam from '../../api/team/createTeam';
import requireAuth from '../../tools/requireAuth';

class FindTournament extends React.Component {
 	constructor(props) {
   		super(props);

   		this.toUser = this.toUser.bind(this);
	   	this.handleNameChange = this.handleNameChange.bind(this);
		this.handleInviteNameChange = this.handleInviteNameChange.bind(this);
	   	this.handleAddInvite = this.handleAddInvite.bind(this);

	   	this.state = {
	   		error: '',
	   		name: '',
	   		nameError: false
	   	};
	}

  	toUser() { this.props.history.push('/user'); }

	handleNameChange(e) { 
		this.setState({ 
			name: e.target.value.trim(),
			nameError: e.target.value ? false : true
		});
	}
	handleInviteNameChange(e) { this.setState({ inviteName: e.target.value.trim() }); }
	handleAddInvite() { 
		if (!this.state.invites.includes(this.state.inviteName))
			this.setState({ invites: [...this.state.invites, this.state.inviteName] }); 
	}

  	submit(e) {
  		e.preventDefault();

  		if (this.state.nameError) {
  			this.setState({ error: 'Error: you must choose a Team Name' });
  			return;
		}

  		this.setState({ error: '' });

  		const newTeam = {
  			"name": this.state.name,
  			'invited_members': this.state.invites
  		}

  		createTeam(newTeam).then(() => { this.toUser(); })
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
								/>
								<FormFeedback>You must choose a tournament name</FormFeedback>	
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="team" md={2}>Team</Label>
							<Col md={8}>
								<Input type="select" name="struct" id="struct" 
									onChange={this.handleStructChange} 
									invalid={this.state.teamError}
								>
          								<option value={''}>----</option>
          								{
          									//get teams from backend
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
						<Button>Submit</Button>
					</Form>
				</Row>
			</Container>
		);
	}
}

export default requireAuth(FindTournament);
