import React from 'react';
import { Button, Card, CardText, CardTitle } from 'reactstrap';  

const TeamCard = (props) => {  

  return (
    <div>
    {props.members &&
    <Card body>
      <CardTitle>Team: {props.name}</CardTitle>
    </Card>
    }</div>
  );
};

export default TeamCard;
