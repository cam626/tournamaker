import React from 'react';
import { Container, Row, Button } from 'reactstrap';
import { getDisplayName } from '../../api/displayName';
import requireAuth from '../../tools/requireAuth';

class User extends React.Component {
 	constructor(props) {
 		super(props);

   		this.toDisplayName = this.toDisplayName.bind(this);
	   	this.state = { displayName: '' };
	}
	
	componentDidMount() {
    	getDisplayName().then((fetchedDisplayName) => {
    		this.setState({ displayName: fetchedDisplayName });
    	});
  	}

  	toDisplayName() { this.props.history.push('/user/displayname'); }

	render() {
		return (
			<Container>
				<Row>
					Hi { this.state.displayName }!
				</Row>
				<Row>
					<Button type='button' onClick={this.toDisplayName}>Update Your Display Name</Button>	
				</Row>				
			</Container>
		);
	}
}

export default requireAuth(User);
