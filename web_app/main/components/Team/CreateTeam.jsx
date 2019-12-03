import React from 'react';
import { Container, Row, Col, Label, Button, Input, CustomInput, 
	Form, FormGroup, FormFeedback, ListGroup, ListGroupItem } from 'reactstrap';
import createTeam from '../../api/team/createTeam';
import requireAuth from '../../tools/requireAuth';
import UserNav from '../User/UserNav';

class CreateTeam extends React.Component {
 	constructor(props) {
   		super(props);

	   	this.handleNameChange = this.handleNameChange.bind(this);
		this.handleInviteNameChange = this.handleInviteNameChange.bind(this);
	   	this.handleAddInvite = this.handleAddInvite.bind(this);

	   	this.state = {
	   		error: '',
	   		name: '',
	   		nameError: false,
	   		inviteName: '',
	   		invites: []
	   	};
	}

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
					<UserNav active='/team/create'/>
				</Row>
				<Row>
					<Form onSubmit={ (e) => this.submit(e) }>
						<FormGroup row>
							<Label for="name" md={2}>Name</Label>
							<Col md={10}>
								<Input type='text' name='name' id='name' placeholder='Team Name'
									onChange={this.handleNameChange}
									invalid={this.state.nameError}
								/>
								<FormFeedback>You must choose a tournament name</FormFeedback>
							</Col>		
						</FormGroup>
						<FormGroup row>
							<Label for="invite" md={3}>Invite People to Your Team</Label>
							<Col md={9}>
								<Input type='text' name='invite' id='invite' placeholder="User's Display Name"
									onChange={this.handleInviteNameChange} 
									onKeyPress={(e) => { 
										if (e.key === 'Enter') {
											e.preventDefault();
											this.handleAddInvite(); 
										}
									}}
								/>	
							</Col>
						</FormGroup>
						<ListGroup>
						{
							this.state.invites.map((name, i) =>
								(<ListGroupItem key={i}>{name}</ListGroupItem>))
						}
    					</ListGroup>

						{
							this.state.error && 
							<h3>{this.state.error}</h3>
						}
						<Button type='button' onClick={this.handleAddInvite}>Add User to Invites</Button><Button>Submit</Button>
					</Form>
				</Row>
			</Container>
		);
	}
}

export default requireAuth(CreateTeam);
