import React from 'react';
import { Container, Row, Alert } from 'reactstrap';
import { getDisplayName, updateDisplayName } from '../../api/displayname';

export default class Header extends React.Component {
 	constructor(props) {
   		super(props);

	   	this.onError = this.onError.bind(this);
	   	this.onDismiss = this.onDismiss.bind(this);
	   	this.state = {
	   		visible: false,
	   		displayName: '',
	   		error: 'Error: Invalid Display Name',
	   		alert: 'danger'
	   	};
	}

	onError(newError) { 
		this.setState({ 
			visible: true,
			error: newError,
			alert: 'danger' 
		}); 
	}
	
	onDismiss() { this.setState({ visible: false }); }
	
	componentDidMount() {
    	getDisplayName().then((fetchedDisplayName) => {
    		this.setState({ displayName: fetchedDisplayName });
    	});
  	}

  	submit() {
  		onDismiss();
  		const newDisplayName = getinput.trim();
  		updateDisplayName(newDisplayName).then(() => {
  			this.setState({ 
  				visible: true, 
  				alert: 'success' 
  			});
  		}).catch((newError) => { this.onError(newError); });
  	}

	render() {
		return (
			<Container>
				<Row>
					{
						this.state.alert == 'danger' ?
						<Alert color='danger' isOpen={visible} toggle={onDismiss}>
							{
								this.state.error == 'taken' ?
								<div>Error: That Display Name has been taken, please choose a different one.</div>
								: <div>this.state.error</div>
							}
						</Alert>
						: <Alert color='success' isOpen={visible} toggle={onDismiss}>
							Display Name successfully updated.
						</Alert>
					}
      			</Row>
				<Row>
					{
						this.state.displayName ?
						<h4>Update Your Display Name</h4>
						: <h4>Please choose a Display Name</h4>
					}
				</Row>
				<Row>
				// add in form and make the alert a form validation feedback
				</Row>
			</Container>
		);
	}
}
