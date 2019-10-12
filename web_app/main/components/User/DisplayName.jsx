import React from 'react';
import { Container, Row, Alert } from 'reactstrap';
import { getDisplayName, updateDisplayName } from '../../api/displayname';

const OnBoard = () => {
	const [visible, setVisible] = React.useState(false);
	const onError = () => setVisible(true);
	const onDismiss = () => setVisible(false);

	// add in an input field and submit button that either says submimt or update
	// add in api call to check name and to update it

	return (
		<Container>
			<Row>
				<Alert color='danger' isOpen={visible} toggle={onDismiss}>
					Error: That Display Name has been taken, please choose a different one.
				</Alert>
      		</Row>
			<Row>{getDisplayName() ?
				<h4>Please choose a Display Name</h4>
				: <h4>Update Your Display Name</h4>
			}</Row>
			<Row>
			</Row>
		</Container>
	);
};

export default OnBoard;
