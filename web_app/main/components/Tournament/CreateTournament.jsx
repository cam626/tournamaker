import React from 'react';
import { Container, Row, Col, Label, Button, Input, 
	Form, FormGroup, FormFeedback, FormText } from 'reactstrap';
import { getDisplayName, updateDisplayName } from '../../api/displayName';
import requireAuth from '../../tools/requireAuth';

class CreateTournament extends React.Component {
 	constructor(props) {
   		super(props);

   		this.toUser = this.toUser.bind(this);
	   	this.onError = this.onError.bind(this);
	   	this.handleNameChange = this.handleNameChange.bind(this);
	   	this.state = {
	   		displayName: '',
	   		inputDisplayName: '',
	   		error: '',
	   		valid: -1
	   	};
	}

  	toUser() { this.props.history.push('/user'); }

	onError(newError) { 
		this.setState({ 
			error: newError,
			valid: 0
		}); 
	}

	handleNameChange(e) { this.setState({ inputDisplayName: e.target.value }); }

  	submit(e) {
  		e.preventDefault();
  		const newDisplayName = this.state.inputDisplayName.trim();
  		updateDisplayName(newDisplayName).then(() => {
  			const isNew = this.state.displayName == '';
  			this.setState({ 
  				displayName: newDisplayName,
  				valid: 1 
  			});
  			fireabse.auth().currentUser.updateProfile({
    			displayName: newDisplayName
  			});
  			if(isNew) this.toUser();
		}).catch((newError) => { this.onError(`Error: ${newError}`); });
  	}

	render() {
		return (
			<Container>
				<Row>
					Create a new Tournament
				</Row>
				<Row>
					<Button type='button' onClick={this.toUser}>Return to User</Button>
				</Row>
				<Row>
					<Form onSubmit={ (e) => this.submit(e) }>
						<FormGroup row>
							<Label for="name" md={2}>Name</Label>
							<Col md={10}>
								<Input type='text' name='name' id='name' placeholder='Tournament Name'
									onChange={this.handleNameChange} 
									valid={this.state.valid == 1}
									invalid={this.state.valid == 0}
								/>
								<FormFeedback valid>You successfully updated your Display Name</FormFeedback>
								<FormFeedback>{this.state.error}</FormFeedback>
								<FormText>Teams will find your tournament through your display name and the tournament name</FormText>
							</Col>		
						</FormGroup>
						<Row form>
							<Col md={6}>
								<FormGroup>
									<Label for="type">Game</Label>
									<Input type='text' name='type' id='type' placeholder='Game Type'
										onChange={this.handleNameChange} 
										valid={this.state.valid == 1}
										invalid={this.state.valid == 0}
									/>
									<FormFeedback valid>You successfully updated your Display Name</FormFeedback>
									<FormFeedback>{this.state.error}</FormFeedback>
									<FormText>The game that this tournament is for, the tournament can record different stats depending on the game</FormText>
								</FormGroup>	
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="struct">Structure</Label>
									<Input type="select" name="struct" id="struct">
          								{
          									//TODO: get the supported structures from the backend
          								}
          								<option>Round Robin</option>
          								<option>Swiss</option>
          								<option>Single Elimination</option>
          								<option>Double Elimination</option>
        							</Input>
									<FormText>The format and structure of this tournament</FormText>
								</FormGroup>	
							</Col>
						</Row>
						<FormGroup row>
							<Label for="description" md={2}>Description</Label>
							<Col md={10}>
								<Input type='textarea' name='description' id='description' placeholder="Your Tournament's Description"
									onChange={this.handleNameChange} />
							</Col>		
						</FormGroup>
						<Row form>
							<Col md={8}>
								<Row>
									<Col md={6}>
										<FormGroup>
        									<Label for="startDate">Start Date</Label>
        									<Input
          										type="date"
          										name="startDate"
          										id="startDate"
          										placeholder="date placeholder"
        									/>
      									</FormGroup>		
									</Col>	
									<Col md={6}>
										<FormGroup>
        									<Label for="startTime">Start Time</Label>
        									<Input
          										type="time"
          										name="startTime"
          										id="startTime"
          										placeholder="time placeholder"
        									/>
      									</FormGroup>								
									</Col>									
								</Row>
								<Row>
									<Col md={6}>
										<FormGroup>
        									<Label for="startDate">End Date</Label>
        									<Input
          										type="date"
          										name="endDate"
          										id="endDate"
          										placeholder="date placeholder"
        									/>
      									</FormGroup>		
									</Col>	
									<Col md={6}>
										<FormGroup>
        									<Label for="endTime">End Time</Label>
        									<Input
          										type="time"
          										name="endTime"
          										id="endTime"
          										placeholder="time placeholder"
        									/>
      									</FormGroup>								
									</Col>									
								</Row>							
							</Col>
							<Col md={4} align-middle>
								<FormGroup check>
        						<Label check>
        							<Input name="single" type="checkbox" />{' '}
        							Signle Day Tournament
        						</Label>
      							</FormGroup>
      							<FormGroup check>
        						<Label check>
        							<Input name="advanced" type="checkbox" />{' '}
        							Advanced Options
        						</Label>
      							</FormGroup>
							</Col>
						</Row>
						{
							//ADVANCED OPTIONS FOR REGISTRATION OPEN AND CLose DATETIMES
							//Validate that dates are sequential
						}
						<Button>Submit</Button>
					</Form>
				</Row>
			</Container>
		);
	}
}

export default requireAuth(CreateTournament);
