import React from 'react';
import { Button, Card, CardText, CardTitle } from 'reactstrap';  

const TournamentCard = (props) => {  
  return (
    <div>
    <Card body>
      <CardTitle>Tournament: {props.name}</CardTitle>
      <CardText>
        Game: {props.game_type} Structure: {props.tournament_structure} <br />
        Description: {props.description}
        {
          props.team_name &&
          <span>
            <br /> Team: {props.team_name} 
          </span>
        }
      </CardText>
    </Card>
    </div>
  );
};

export default TournamentCard;
