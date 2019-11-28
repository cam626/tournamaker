import React from 'react';
import { Button, Card, CardText, CardTitle } from 'reactstrap';  
import teamInvite from '../../api/team/teamInvite';

const TeamInviteCard = (props) => {
  const accept = () => { teamInvite(props.api_key, true).then(() => props.update()); };
  const decline = () => { teamInvite(props.api_key, false).then(() => props.update()); };

  return (
    <div>
    {props.members &&
    <Card body>
      <CardTitle>Invite to join a team!</CardTitle>
      <CardText>
        Team Name: {props.name} <br />
      </CardText>
      <Button color='success' onClick={accept}>accept invite</Button> <Button color='danger' onClick={decline}>decline invite</Button>
    </Card>
    }</div>
  );
};

export default TeamInviteCard;
