import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Landing from '../Landing';
import _404 from '../_404';
import SignIn from './Auth/SignIn';
import User from './User/User';
import DisplayName from './User/DisplayName';

export default (props) => (<div>
	<Header {...props}/>
  	<Switch>
		<Route exact path='/' component={Landing} />
		<Route path='/signin' component={SignIn} />
		<Route path='/user/displayname' render={() => <DisplayName {...props}/>} />
		<Route path='/user' render={() => <User {...props}/>} />
		<Route path='*' component={_404} />
	</Switch>
</div>);
	