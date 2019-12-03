import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Landing from '../Landing';
import _404 from '../_404';
import API from './API';
import SignIn from './Auth/SignIn';
import User from './User/User';
import DisplayName from './User/DisplayName';
import CreateTournament from './Tournament/CreateTournament';
import CreateTeam from './Team/CreateTeam';
import FIndTournament from './Tournament/FindTournament';

export default (props) => (<div>
	<Header {...props}/>
  	<Switch>
		<Route exact path='/' component={Landing} />
		<Route path='/api' component={API} />
		<Route path='/signin' component={SignIn} />
		<Route path='/user/displayname' render={() => <DisplayName {...props}/>} />
		<Route path='/user/dashboard' render={() => <User {...props}/>} />
		<Route path='/tournament/create' render={() => <CreateTournament {...props}/>} />
		<Route path='/tournament/find' render={() => <FindTournament {...props}/>} />
		<Route path='/team/create' render={() => <CreateTeam {...props}/>} />
		<Route path='*' component={_404} />
	</Switch>
</div>);
