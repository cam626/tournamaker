import React from 'react';
import { Button, Card, CardText, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';  
import { getNamesFromKeys } from '../../api/user/displayName';

class TeamCard extends React.Component {
 	constructor(props) {
   		super(props);

   		this.state = {
   			members: []
   		}
   	}

   	componentDidMount() {
   		this.componentDidUpdate();
   	}

  	componentDidUpdate() {
      console.log(this.props);
    	this.props.members && getNamesFromKeys(this.props.members)
    	.then((dict) => this.setState({ members: dict }));
  	}

  	render() {
		return (
    		<div>{ this.state.members &&
    			<Card body>
      				<CardTitle>Team: {this.props.name}</CardTitle>
	      			<CardText>
    	  				Members: 
      					<ListGroup>
      						{Object.entries(this.state.members).map(([key, value]) => (<ListGroupItem key={key}>{value}</ListGroupItem>))}
      					</ListGroup>
      				</CardText>
    			</Card>
    		}</div>
  		);	
	}
};

export default TeamCard;
