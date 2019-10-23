import ReactDOM from 'react-dom';
import React from 'react';

import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

import { HashRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './Landing';
import _404 from './_404';
import SignIn from './components/Auth/SignIn';
import User from './components/User/User';
import DisplayName from './components/User/DisplayName';

ReactDOM.render(
	<HashRouter>
  		<Header />
  		<Switch>
			<Route exact path='/' component={Landing} />
			<Route path='/signin' component={SignIn} />
			<Route path='/user/displayname' component={DisplayName} />
			<Route path='/user/' component={User} />
			<Route path='*' component={_404} />
		</Switch>
	</HashRouter>,
	document.getElementById('app')
);
