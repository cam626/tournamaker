import React from 'react';
import { Container, Row, Col, Label, Button, Input, CustomInput, 
	Form, FormGroup, FormFeedback, FormText } from 'reactstrap';
import createTournament from '../../api/tournament/createTournament';
import requireAuth from '../../tools/requireAuth';
import UserNav from '../User/UserNav';

class CreateTournament extends React.Component {
 	constructor(props) {
   		super(props);

	   	this.handleNameChange = this.handleNameChange.bind(this);
	   	this.handleGameChange = this.handleGameChange.bind(this);
		this.handleStructChange = this.handleStructChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);
		this.handleAdvance = this.handleAdvance.bind(this);
		this.handleSingle = this.handleSingle.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
		this.handleRegStartDateChange = this.handleRegStartDateChange.bind(this);
		this.handleRegStartTimeChange = this.handleRegStartTimeChange.bind(this);
		this.handleRegEndDateChange = this.handleRegEndDateChange.bind(this);
		this.handleRegEndTimeChange = this.handleRegEndTimeChange.bind(this);
	   	
	   	this.state = {
	   		error: '',
	   		name: '',
	   		nameError: false,
	   		game: '',
	   		struct: 'round_robin',
	   		desc: '',
	   		advanced: false,
	   		single: false,
	   		startDate: '',
	   		startTime: '',
	   		endDate: '',
	   		endTime: '',
	   		regStartDate: '',
	   		regStartTime: '',
	   		regEndDate: '',
	   		regEndTime: ''
	   	};
	}

	handleNameChange(e) { 
		this.setState({ 
			name: e.target.value.trim(),
			nameError: e.target.value ? false : true 
		});
	}
	handleGameChange(e) { this.setState({ game: e.target.value.trim() }); }
	handleStructChange(e) { this.setState({ struct: e.target.value }); }
	handleDescChange(e) { this.setState({ desc: e.target.value.trim() }); }
	handleAdvance(e) { this.setState({ advanced: !this.state.advanced }); }
	handleSingle(e) { this.setState({ single: !this.state.single }); }
	handleStartDateChange(e) { this.setState({ startDate: e.target.value }); console.log(this.state.startDate);}
	handleStartTimeChange(e) { this.setState({ startTime: e.target.value }); console.log(this.state.startTime);}
	handleEndDateChange(e) { this.setState({ endDate: e.target.value }); }
	handleEndTimeChange(e) { this.setState({ endTime: e.target.value }); }
	handleRegStartDateChange(e) { this.setState({ regStartDate: e.target.value }); }
	handleRegStartTimeChange(e) { this.setState({ regStartTime: e.target.value }); }
	handleRegEndDateChange(e) { this.setState({ regEndDate: e.target.value }); }
	handleRegEndTimeChange(e) { this.setState({ regEndTime: e.target.value }); }

  	submit(e) {
  		e.preventDefault();

  		if (this.state.nameError) {
  			this.setState({ error: 'Error: you must choose a name' });
  			return;
		}
  		
  		this.setState({ error: '' });

  		const newTournament = {
  			"name": this.state.name,
  			"game_type": this.state.game,
  			"tournament_structure": this.state.struct,
  			"description": this.state.desc,
  			"start_date_time": `${this.state.startDate} ${this.state.startTime}`,  			
		}
		if (!this.state.single)		
			newTournament["end_date_time"] = `${this.state.endDate} ${this.state.endTime}`;
		if (this.state.advanced) {
			newTournament["registration_open_date_time"] = `${this.state.regStartDate} ${this.state.regStartTime}`;
			newTournament["registration_close_date_time"] = `${this.state.regEndDate} ${this.state.regEndTime}`;
		}

  		createTournament(newTournament).then(() => { this.toUser(); })
  		.catch((newError) => { this.setState({ error: `Error: ${newError}` }); });
  	}

	render() {
		return (
			<Container>
				<Row>
					<UserNav active='/tournament/create'/>
				</Row>
				<Row>
					<Form onSubmit={ (e) => this.submit(e) }>
						<FormGroup row>
							<Label for="name" md={2}>Name</Label>
							<Col md={10}>
								<Input type='text' name='name' id='name' placeholder='Tournament Name'
									onChange={this.handleNameChange}
									invalid={this.state.nameError != ''}
								/>
								<FormFeedback>You must choose a tournament name</FormFeedback>
								<FormText>Teams will find your tournament through your display name and the tournament name</FormText>
							</Col>		
						</FormGroup>
						<Row form>
							<Col md={6}>
								<FormGroup>
									<Label for="type">Game</Label>
									<Input type='text' name='type' id='type' placeholder='Game Type'
										onChange={this.handleGameChange} 
									/>
									<FormText>The game that this tournament is for, the tournament can record different stats depending on the game</FormText>
								</FormGroup>	
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="struct">Structure</Label>
									<Input type="select" name="struct" id="struct" onChange={this.handleStructChange} >
          								{
          									//TODO: get the supported structures from the backend
          								}
          								<option value={'round_robin'}>Round Robin</option>
          								<option value={'swiss'}>Swiss</option>
           								<option value={'1_elimination'} disabled>Single Elimination</option>
          								<option value={'2_elimination'} disabled>Double Elimination</option>
        							</Input>
									<FormText>The format and structure of this tournament</FormText>
								</FormGroup>	
							</Col>
						</Row>
						<FormGroup row>
							<Label for="description" md={2}>Description</Label>
							<Col md={10}>
								<Input type='textarea' name='description' id='description' placeholder="Your Tournament's Description"
									onChange={this.handleDescChange} />
							</Col>		
						</FormGroup>
						<Row>
							<FormGroup>
        						<div>
          							<CustomInput type="checkbox" id="single" label="Single Day Tournament" onChange={this.handleSingle} inline />
          							<CustomInput type="checkbox" id="advanced" label="Advanced Options"  onChange={this.handleAdvance} inline />
        						</div>
      						</FormGroup>
						</Row>
								<Row>
									<Col md={6}>
										<FormGroup>
        									<Label for="startDate">Start Date</Label>
        									<Input
          										type="date"
          										name="startDate"
          										id="startDate"
          										placeholder="date placeholder"
        										onChange={this.handleStartDateChange}
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
          										 onChange={this.handleStartTimeChange}
        									/>
      									</FormGroup>								
									</Col>									
								</Row>
							{
								!this.state.single &&
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
							}
						{
							this.state.advanced &&
							<div>
								<Row>
									<Col md={6}>
										<FormGroup>
        									<Label for="startDate">Registration Start Date</Label>
        									<Input
          										type="date"
          										name="regStartDate"
          										id="startDate"
          										placeholder="date placeholder"
        									/>
      									</FormGroup>		
									</Col>	
									<Col md={6}>
										<FormGroup>
        									<Label for="startTime">Registration Start Time</Label>
        									<Input
          										type="time"
          										name="regStartTime"
          										id="startTime"
          										placeholder="time placeholder"
        									/>
      									</FormGroup>								
									</Col>									
								</Row>
								<Row>
									<Col md={6}>
										<FormGroup>
        									<Label for="startDate">Registration End Date</Label>
        									<Input
          										type="date"
          										name="regEndDate"
          										id="endDate"
          										placeholder="date placeholder"
        									/>
      									</FormGroup>		
									</Col>	
									<Col md={6}>
										<FormGroup>
        									<Label for="endTime">Registration End Time</Label>
        									<Input
          										type="time"
          										name="regEndTime"
          										id="endTime"
          										placeholder="time placeholder"
        									/>
      									</FormGroup>								
									</Col>									
								</Row>
							</div>
						}
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

export default requireAuth(CreateTournament);
