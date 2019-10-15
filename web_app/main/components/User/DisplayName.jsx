import React from 'react';
import { Container, Row, Label, Button, 
	Form, FormGroup, FormFeedback, FormText } from 'reactstrap';
import { getDisplayName, updateDisplayName } from '../../api/displayname';

export default class Header extends React.Component {
 	constructor(props) {
   		super(props);

   		this.toUser = this.toUser.bind(this);
	   	this.onError = this.onError.bind(this);
	   	this.state = {
	   		displayName: '',
	   		error: '',
	   		valid: false
	   	};
	}

	onError(newError) { 
		this.setState({ 
			error: newError,
			valid: false 
		}); 
	}
	
	componentDidMount() {
    	getDisplayName().then((fetchedDisplayName) => {
    		this.setState({ displayName: fetchedDisplayName });
    	});
  	}

  	toUser() { this.props.history.push('/'); }

  	submit() {
  		e.preventDefault();
  		onDismiss();
  		const newDisplayName = this.state.inputDisplayName.trim();
  		updateDisplayName(newDisplayName).then(() => {
  			this.setState({ 
  				displayName: newDisplayName
  				visible: true, 
  				valid: true 
  			});
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
								value={inputDisplayName} 
								valid={this.state.valid}
								invalid={this.state.valid}
							/>
							<FormFeedback valid>You successfully updated your email</FormFeedback>
							<FormFeedback invalid>{this.state.error}</FormFeedback>
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
