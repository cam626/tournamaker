import React from 'react';
import { Container, Row, Label, Button, Input, 
	Form, FormGroup, FormFeedback, FormText } from 'reactstrap';
import { getDisplayName, updateDisplayName } from '../../api/displayName';
import requireAuth from '../../tools/requireAuth';
import fireabse from 'firebase';

class DisplayName extends React.Component {
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
	
	componentDidMount() {
    	getDisplayName().then((fetchedDisplayName) => {
    		this.setState({ displayName: fetchedDisplayName });
    	});
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
					{
						this.state.displayName ?
						<h4>Update Your Display Name</h4>
						: <h4>Please choose a Display Name</h4>
					}
				</Row>
				<Row>
					<Form onSubmit={ (e) => this.submit(e) }>
						<FormGroup>
							<Label for="displayName">Display Name</Label>
							<Input type='text' name='displayName' id='displayName' placeholder='Display Name'
								onChange={this.handleNameChange} 
								valid={this.state.valid == 1}
								invalid={this.state.valid == 0}
							/>
							<FormFeedback valid>You successfully updated your Display Name</FormFeedback>
							<FormFeedback>{this.state.error}</FormFeedback>
							<FormText>Your Display Name will be how other users can identify you.</FormText>
						</FormGroup>
						{
							this.state.displayName && <Button type='button' onClick={this.toUser}>Return to User</Button>
      					}
      					<Button>Submit</Button>
					</Form>
				</Row>
			</Container>
		);
	}
}

export default requireAuth(DisplayName);
